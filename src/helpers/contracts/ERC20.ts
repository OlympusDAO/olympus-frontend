import { Contract as EthersContract } from "@ethersproject/contracts";
import { OHMTokenStackProps } from "@olympusdao/component-library";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import { AddressMap } from "src/constants/addresses";
import { Contract, ContractConfig } from "src/helpers/contracts/Contract";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { IERC20 } from "src/typechain";

export interface ERC20Config<TAddressMap extends AddressMap = AddressMap>
  extends Omit<ContractConfig<TAddressMap>, "abi"> {
  decimals: number;
  purchaseUrl: string;
  icons: OHMTokenStackProps["tokens"];
  getPrice: (networkId: keyof TAddressMap) => Promise<DecimalBigNumber>;
}

export class ERC20<
  TContract extends EthersContract = IERC20,
  TAddressMap extends AddressMap = AddressMap,
> extends Contract<TContract, TAddressMap> {
  /**
   * An array of icons for this token
   *
   * Commonly, there is only one icon. For LP tokens, there are two.
   */
  icons: ERC20Config<TAddressMap>["icons"];

  /**
   * The number of decimal used by the tokens ERC20 contract.
   */
  decimals: ERC20Config<TAddressMap>["decimals"];

  /**
   * A url where this token can be purchased
   */
  purchaseUrl: ERC20Config<TAddressMap>["purchaseUrl"];

  /**
   * Returns the price of this token denominated in USD.
   */
  getPrice: ERC20Config<TAddressMap>["getPrice"];

  constructor(config: ERC20Config<TAddressMap>) {
    super({
      abi: IERC20_ABI,
      name: config.name,
      addresses: config.addresses,
    });

    this.icons = config.icons;
    this.decimals = config.decimals;
    this.purchaseUrl = config.purchaseUrl;
    this.getPrice = config.getPrice.bind(this);
  }
}
