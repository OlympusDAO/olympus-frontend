import { OHMTokenStackProps } from "@olympusdao/component-library";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import { AddressMap } from "src/constants/addresses";
import { Contract, ContractConfig } from "src/helpers/contracts/Contract/Contract";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { NetworkId } from "src/networkDetails";
import { IERC20 } from "src/typechain";

export interface TokenConfig<TAddressMap extends AddressMap = AddressMap>
  extends Omit<ContractConfig<TAddressMap>, "abi"> {
  decimals: number;
  purchaseUrl: string;
  icons: OHMTokenStackProps["tokens"];
  getPrice: (networkId: NetworkId) => Promise<DecimalBigNumber>;
}

export class Token<TAddressMap extends AddressMap = AddressMap> extends Contract<IERC20, TAddressMap> {
  /**
   * An array of icons for this token
   *
   * Commonly, there is only one icon. For LP tokens, there are two.
   */
  icons: OHMTokenStackProps["tokens"];

  /**
   * The number of decimal used by the tokens ERC20 contract.
   */
  decimals: number;

  /**
   * A url where this token can be purchased
   */
  purchaseUrl: string;

  /**
   * Returns the price of this token denominated in USD.
   */
  getPrice: (networkId: NetworkId) => Promise<DecimalBigNumber>;

  constructor(config: TokenConfig<TAddressMap>) {
    super({ abi: IERC20_ABI, name: config.name, addresses: config.addresses });

    this.icons = config.icons;
    this.decimals = config.decimals;
    this.getPrice = config.getPrice;
    this.purchaseUrl = config.purchaseUrl;
  }
}
