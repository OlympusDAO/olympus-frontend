import { AddressMap } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";

import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";
import { Factory } from "./Contract";
import { Token, TokenConfig } from "./Token";

export interface LPTokenConfig<TFactory extends Factory = Factory, TAddressMap extends AddressMap = AddressMap>
  extends TokenConfig<TFactory, TAddressMap> {
  tokens: [Token, Token];
}

export class LPToken<TFactory extends Factory = Factory, TAddressMap extends AddressMap = AddressMap> extends Token<
  TFactory,
  TAddressMap
> {
  constructor(config: LPTokenConfig<TFactory, TAddressMap>) {
    super({
      name: config.name,
      icons: config.icons,
      factory: config.factory,
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

      const tokenOneTotalValue = tokenOneSupply.mul(onePerUsd);
      const tokenTwoTotalValue = tokenTwoSupply.mul(twoPerUsd);

      const totalValueOfLpInUsd = tokenOneTotalValue.add(tokenTwoTotalValue);

      return totalValueOfLpInUsd.div(_totalSupply);
    };
  }
}
