import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { AddressMap } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";
import { PairContract } from "src/typechain";

import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";
import { Token, TokenConfig } from "./Token";

export interface LPTokenConfig<TAddressMap extends AddressMap = AddressMap> extends TokenConfig<TAddressMap> {
  tokens: [Token, Token];
}

export class LPToken<TAddressMap extends AddressMap = AddressMap> extends Token<PairContract, TAddressMap> {
  constructor(config: LPTokenConfig<TAddressMap>) {
    super({
      name: config.name,
      icons: config.icons,
      abi: PAIR_CONTRACT_ABI,
      decimals: config.decimals,
      addresses: config.addresses,
      purchaseUrl: config.purchaseUrl,
    });

    this.customPricingFunc = async networkId => {
      const _networkId = networkId as NetworkId;

      const contract = this.getEthersContract(_networkId);

      const [reserves, totalSupply, onePerUsd, twoPerUsd] = await Promise.all([
        contract.getReserves(),
        contract.totalSupply(),
        config.tokens[0].getPrice(_networkId),
        config.tokens[1].getPrice(_networkId),
      ]);

      const tokenOneSupply = new DecimalBigNumber(reserves[0], config.tokens[0].decimals);
      const tokenTwoSupply = new DecimalBigNumber(reserves[1], config.tokens[1].decimals);

      const _totalSupply = new DecimalBigNumber(totalSupply, this.decimals);

      const tokenOneTotalValue = tokenOneSupply.mul(onePerUsd, 9);
      const tokenTwoTotalValue = tokenTwoSupply.mul(twoPerUsd, 9);

      const totalValueOfLpInUsd = tokenOneTotalValue.add(tokenTwoTotalValue);

      return totalValueOfLpInUsd.div(_totalSupply, 9);
    };
  }
}
