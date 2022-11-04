import { Contract as EthersContract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import { ethers, Signer } from "ethers";
import { AddressMap } from "src/constants/addresses";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";

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
   * @param provider optional custom provider, i.e. for governance where we need archive node
   */
  getEthersContract = (networkId: keyof TAddressMap, provider?: ethers.providers.Provider) => {
    if (!this._contractCache[networkId]) {
      const address = this.getAddress(networkId);
      const localProvider = provider || Providers.getStaticProvider(networkId as NetworkId);

      this._contractCache[networkId] = this._factory.connect(address, localProvider) as ReturnType<TFactory["connect"]>;
    }

    return this._contractCache[networkId];
  };
}
