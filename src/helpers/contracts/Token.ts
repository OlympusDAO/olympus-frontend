import { OHMTokenStackProps } from "@olympusdao/component-library";
import { AddressMap } from "src/constants/addresses";
import { Contract, ContractConfig, Factory } from "src/helpers/contracts/Contract";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { NetworkId } from "src/networkDetails";

import { getCoingeckoPrice } from "../pricing/getCoingeckoPrice";
import { assert } from "../types/assert";

export interface TokenConfig<TFactory extends Factory = Factory, TAddressMap extends AddressMap = AddressMap>
  extends ContractConfig<TFactory, TAddressMap> {
  decimals: number;
  purchaseUrl: string;
  icons: NonNullable<OHMTokenStackProps["tokens"]>;
  customPricingFunc?: (networkId: keyof TAddressMap) => Promise<DecimalBigNumber>;
}

export class Token<TFactory extends Factory = Factory, TAddressMap extends AddressMap = AddressMap> extends Contract<
  TFactory,
  TAddressMap
> {
  /**
   * An array of icons for this token
   *
   * Commonly, there is only one icon. For LP tokens, there are two.
   */
  icons: TokenConfig<TFactory, TAddressMap>["icons"];

  /**
   * The number of decimal used by the tokens ERC20 contract.
   */
  decimals: TokenConfig<TFactory, TAddressMap>["decimals"];

  /**
   * A url where this token can be purchased
   */
  purchaseUrl: TokenConfig<TFactory, TAddressMap>["purchaseUrl"];

  /**
   * Function that returns the price of this token in USD
   */
  customPricingFunc?: TokenConfig<TFactory, TAddressMap>["customPricingFunc"];

  constructor(config: TokenConfig<TFactory, TAddressMap>) {
    super({ name: config.name, factory: config.factory, addresses: config.addresses });

    this.icons = config.icons;
    this.decimals = config.decimals;
    this.purchaseUrl = config.purchaseUrl;
    this.customPricingFunc = config.customPricingFunc;
  }

  async getPrice(networkId: keyof TAddressMap) {
    if (this.customPricingFunc) return this.customPricingFunc(networkId);

    const address = this.addresses[networkId];
    assert(address, `Address should exist for token: ${this.name} on network: ${networkId.toString()}`);

    // Default to coingecko
    return getCoingeckoPrice(networkId as NetworkId, address as unknown as string);
  }
}
