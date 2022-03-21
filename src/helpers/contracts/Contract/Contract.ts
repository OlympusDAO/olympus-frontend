import { Contract as EthersContract, ContractInterface } from "@ethersproject/contracts";
import { AddressMap } from "src/constants/addresses";

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
  name: string;

  /**
   * Map of addresses for each network this contract exists
   */
  addresses: TAddressMap;

  /**
   * Generated json ABI for the contract
   */
  private _abi: ContractInterface;

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
   * Returns a disconnected ethers version of this contract for a given network.
   *
   * Disconnected means the contract isn't tied to any provider, that can
   * be done by calling `connect()` on the contract returned by this function,
   * that will return a **new instance** of this contract that **is** tied to a provider.
   *
   * @param networkId The network you want the contract on
   */
  getEthersContract = (networkId: keyof TAddressMap): TContract => {
    if (!this._ethersContractCache[networkId]) {
      const address = this.getAddress(networkId);

      this._ethersContractCache[networkId] = new EthersContract(address, this._abi);
    }

    return this._ethersContractCache[networkId] as TContract;
  };
}
