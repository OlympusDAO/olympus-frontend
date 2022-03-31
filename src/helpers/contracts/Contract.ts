import { Contract as EthersContract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { AddressMap } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";

import { Providers } from "../providers/Providers/Providers";

export declare class Factory {
  connect(address: string, signerOrProvider: Signer | Provider): EthersContract;
}

export interface ContractConfig<TFactory extends Factory = Factory, TAddressMap extends AddressMap = AddressMap> {
  name: string;
  factory: TFactory;
  addresses: TAddressMap;
}

export class Contract<TFactory extends Factory = Factory, TAddressMap extends AddressMap = AddressMap> {
  /**
   * A contract name that can be displayed to a user
   *
   * Preferably, this should be kept in-sync with
   * the contract name tag on Etherscan.
   */
  name: ContractConfig<TFactory, TAddressMap>["name"];

  /**
   * Map of addresses for each network this contract exists
   */
  addresses: ContractConfig<TFactory, TAddressMap>["addresses"];

  /**
   * Generated json ABI for the contract
   */
  private _factory: ContractConfig<TFactory, TAddressMap>["factory"];

  /**
   * Cache used for contracts to prevent recomputing them repeatedly
   */
  private _contractCache = {} as Record<keyof TAddressMap, ReturnType<TFactory["connect"]>>;

  constructor(config: ContractConfig<TFactory, TAddressMap>) {
    this._factory = config.factory;
    this.name = config.name;
    this.addresses = config.addresses;
  }

  getAddress = (networkId: keyof TAddressMap): string => {
    return this.addresses[networkId] as unknown as string;
  };

  /**
   * Returns a ethers version of this contract for a given network.
   *
   * By default, the contract is connected to a StaticJsonRpcProvider.
   * If you wish to connect the contract to the wallet's signer, simply
   * call the `connect()` method on the returned contract
   *
   * @param networkId The network you want the contract on
   */
  getEthersContract = (networkId: keyof TAddressMap) => {
    if (!this._contractCache[networkId]) {
      const address = this.getAddress(networkId);
      const provider = Providers.getStaticProvider(networkId as NetworkId);

      this._contractCache[networkId] = this._factory.connect(address, provider) as ReturnType<TFactory["connect"]>;
    }

    return this._contractCache[networkId];
  };
}
