import { Contract as EthersContract, ContractInterface } from "@ethersproject/contracts";
import { OHMTokenStackProps } from "@olympusdao/component-library";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import { AddressMap } from "src/constants/addresses";
import { Contract, ContractConfig } from "src/helpers/contracts/Contract";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { NetworkId } from "src/networkDetails";
import { IERC20 } from "src/typechain";

import { getCoingeckoPrice } from "../misc/getCoingeckoPrice";
import { assert } from "../types/assert";

export interface TokenConfig<TAddressMap extends AddressMap = AddressMap>
  extends Omit<ContractConfig<TAddressMap>, "abi"> {
  decimals: number;
  purchaseUrl: string;
  abi?: ContractInterface;
  icons: OHMTokenStackProps["tokens"];
  customPricingFunc?: (networkId: keyof TAddressMap) => Promise<DecimalBigNumber>;
}

export class Token<
  TContract extends EthersContract = IERC20,
  TAddressMap extends AddressMap = AddressMap,
> extends Contract<TContract, TAddressMap> {
  /**
   * An array of icons for this token
   *
   * Commonly, there is only one icon. For LP tokens, there are two.
   */
  icons: TokenConfig<TAddressMap>["icons"];

  /**
   * The number of decimal used by the tokens ERC20 contract.
   */
  decimals: TokenConfig<TAddressMap>["decimals"];

  /**
   * A url where this token can be purchased
   */
  purchaseUrl: TokenConfig<TAddressMap>["purchaseUrl"];

  /**
   * Function that returns the price of this token in USD
   */
  customPricingFunc?: TokenConfig<TAddressMap>["customPricingFunc"];

  constructor(config: TokenConfig<TAddressMap>) {
    super({
      name: config.name,
      addresses: config.addresses,
      abi: config.abi || IERC20_ABI,
    });

    this.icons = config.icons;
    this.decimals = config.decimals;
    this.purchaseUrl = config.purchaseUrl;
    this.customPricingFunc = config.customPricingFunc;
  }

  async getPrice(networkId: keyof TAddressMap) {
    if (this.customPricingFunc) return this.customPricingFunc(networkId);

    const address = this.addresses[networkId];
    assert(address, `Address should exist for token: ${this.name} on network: ${networkId}`);

    // Default to coingecko
    return getCoingeckoPrice(networkId as NetworkId, address as unknown as string);
  }
}
