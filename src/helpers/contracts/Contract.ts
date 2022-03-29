import { Contract as EthersContract, ContractInterface } from "@ethersproject/contracts";
import { AddressMap } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";

import { Providers } from "../providers/Providers/Providers";

export interface ContractConfig<TAddressMap extends AddressMap = AddressMap> {
  name: string;
  addresses: TAddressMap;
  abi: ContractInterface;
}

export class Contract<TContract extends EthersContract = EthersContract, TAddressMap extends AddressMap = AddressMap> {
  /**
   * A contract name that can be displayed to a user
   *
   * Preferably, this should be kept in-sync with
   * the contract name tag on Etherscan.
   */
  name: ContractConfig<TAddressMap>["name"];

  /**
   * Map of addresses for each network this contract exists
   */
  addresses: ContractConfig<TAddressMap>["addresses"];

  /**
   * Generated json ABI for the contract
   */
  private _abi: ContractConfig<TAddressMap>["abi"];

  /**
   * Cache used for contracts to prevent recomputing them repeatedly
   */
  private _ethersContractCache = {} as Record<keyof TAddressMap, EthersContract>;

  constructor(config: ContractConfig<TAddressMap>) {
    this._abi = config.abi;
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
  getEthersContract = (networkId: keyof TAddressMap): TContract => {
    if (!this._ethersContractCache[networkId]) {
      const address = this.getAddress(networkId);
      const provider = Providers.getStaticProvider(networkId as NetworkId);

      this._ethersContractCache[networkId] = new EthersContract(address, this._abi, provider);
    }

    return this._ethersContractCache[networkId] as TContract;
  };
}
