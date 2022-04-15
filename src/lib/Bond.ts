import { NetworkId } from "src/constants";

interface BondAddresses {
  reserveAddress: string;
  bondAddress: string;
}

type NetworkAddresses = { [key in NetworkId]?: BondAddresses };

// Keep all LP specific fields/logic within the LPBond class
interface LPBondOpts {
  networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
}

export class LPBond {
  readonly networkAddrs: NetworkAddresses;

  constructor(lpBondOpts: LPBondOpts) {
    this.networkAddrs = lpBondOpts.networkAddrs;
  }

  getAddressForReserve(NetworkId: NetworkId) {
    return this.networkAddrs[NetworkId]?.reserveAddress;
  }
}
