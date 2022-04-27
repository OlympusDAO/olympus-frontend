import { BigNumber } from "ethers";
import { AddressMap } from "src/constants/addresses";
import { BALANCER_VAULT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { BalancerV2Pool, PairContract } from "src/typechain";

import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";
import { Factory } from "./Contract";
import { Token, TokenConfig } from "./Token";

export interface LPTokenConfig<TFactory extends Factory = Factory, TAddressMap extends AddressMap = AddressMap>
  extends TokenConfig<TFactory, TAddressMap> {
  tokens: [Token, Token];
  type: "sushiswap" | "curve" | "balancer" | "uniswapv2" | "uniswapv3";
}

export class LPToken<TFactory extends Factory = Factory, TAddressMap extends AddressMap = AddressMap> extends Token<
  TFactory,
  TAddressMap
> {
  type: LPTokenConfig["type"];
  tokens: LPTokenConfig["tokens"];

  constructor(config: LPTokenConfig<TFactory, TAddressMap>) {
    super({
      name: config.name,
      icons: config.icons,
      factory: config.factory,
      decimals: config.decimals,
      addresses: config.addresses,
      purchaseUrl: config.purchaseUrl,
    });

    this.type = config.type;
    this.tokens = config.tokens;
  }

  async getPrice(networkId: keyof TAddressMap) {
    switch (this.type) {
      case "sushiswap":
        return this._calculateUniV2LPValue(networkId);
      case "uniswapv2":
        return this._calculateUniV2LPValue(networkId);
      case "balancer":
        return this._calculateBalancerLPValue(networkId);
      default:
        return new DecimalBigNumber("0");
    }
  }

  private _calculateUniV2LPValue = async (networkId: keyof TAddressMap) => {
    const contract = this.getEthersContract(networkId) as PairContract;

    const [tokenBalances, lpSupply, ...tokenPrices] = await Promise.all([
      contract.getReserves().then(balances =>
        balances
          // We filter out blockTimestampLast from the balances
          .filter(balance => balance instanceof BigNumber)
          .map((balance, i) => new DecimalBigNumber(balance as BigNumber, this.tokens[i].decimals)),
      ),
      contract.totalSupply().then(supply => new DecimalBigNumber(supply, this.decimals)),
      ...this.tokens.map(token => token.getPrice(networkId as NetworkId)),
    ]);

    const totalValueOfLpInUsd = tokenBalances.reduce(
      // For each token, we multiply the amount in the pool by it's USD value
      (sum, balance, i) => sum.add(balance.mul(tokenPrices[i])),
      new DecimalBigNumber("0"),
    );

    return totalValueOfLpInUsd.div(lpSupply);
  };

  private _calculateBalancerLPValue = async (networkId: keyof TAddressMap) => {
    const contract = this.getEthersContract(networkId) as BalancerV2Pool;
    const vault = BALANCER_VAULT.getEthersContract(NetworkId.MAINNET);

    const [poolId, lpSupply, ...tokenPrices] = await Promise.all([
      contract.getPoolId(),
      // Normalize to the correct number of decimal places
      contract.totalSupply().then(supply => new DecimalBigNumber(supply, this.decimals)),
      // Get the prices of an arbitrary amount of tokens
      ...this.tokens.map(token => token.getPrice(networkId as NetworkId)),
    ]);

    const tokenBalances = await vault
      .getPoolTokens(poolId)
      // We take each balance and normalize it to that tokens specific amount of decimals
      .then(({ balances }) => balances.map((balance, i) => new DecimalBigNumber(balance, this.tokens[i].decimals)));

    const totalValueOfLpInUsd = tokenBalances.reduce(
      // For each token, we multiply the amount in the pool by it's USD value
      (sum, balance, i) => sum.add(balance.mul(tokenPrices[i])),
      new DecimalBigNumber("0"),
    );

    return totalValueOfLpInUsd.div(lpSupply);
  };
}
