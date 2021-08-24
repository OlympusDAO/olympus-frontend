import { StaticJsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";

import { abi as ierc20Abi } from "src/abi/IERC20.json";

export enum NetworkID {
  Mainnet = 1,
  Testnet = 4,
}

export enum BondType {
  StableCoin,
  LP,
}

export interface BondAddresses {
  reserveAddress: string;
  bondAddress: string;
}

export interface NetworkAddresses {
  [NetworkID.Mainnet]: BondAddresses;
  [NetworkID.Testnet]: BondAddresses;
}

abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly type: BondType;
  readonly bondIconUrl: string; // Its not a URL its  an svg.. HOW DO WE DO THIS.
  readonly bondContract: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: NetworkAddresses;

  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: Boolean;
  abstract reserveContract: ethers.ContractInterface; // Token ABI

  constructor(
    name: string,
    displayName: string,
    type: BondType,
    bondIconUrl: string,
    bondContract: ethers.ContractInterface,
    networkAddrs: NetworkAddresses,
  ) {
    this.name = name;
    this.displayName = displayName;
    this.type = type;
    this.bondIconUrl = bondIconUrl;
    this.bondContract = bondContract;
    this.networkAddrs = networkAddrs;
  }

  // Note: do we cache this and not recreate the object everytime?
  getContractForBond(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.networkAddrs[networkID].bondAddress;
    return new ethers.Contract(bondAddress, this.bondContract, provider);
  }

  getContractForReserve(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.networkAddrs[networkID].reserveAddress;
    return new ethers.Contract(bondAddress, this.reserveContract, provider);
  }
}

// Keep all LP specific fields/logic within the LPBond class
export class LPBond extends Bond {
  readonly isLP = true;
  readonly lpUrl: string;
  readonly reserveContract: ethers.ContractInterface;

  constructor(
    name: string,
    displayName: string,
    bondIconUrl: string,
    lpUrl: string,
    bondContract: ethers.ContractInterface,
    reserveContract: ethers.ContractInterface,
    networkAddrs: NetworkAddresses,
  ) {
    super(name, displayName, BondType.LP, bondIconUrl, bondContract, networkAddrs);

    this.lpUrl = lpUrl;
    this.reserveContract = reserveContract;
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export class StableBond extends Bond {
  readonly isLP = false;
  readonly reserveContract: ethers.ContractInterface;

  constructor(
    name: string,
    displayName: string,
    bondIconUrl: string,
    bondContract: ethers.ContractInterface,
    networkAddrs: NetworkAddresses,
  ) {
    super(name, displayName, BondType.LP, bondIconUrl, bondContract, networkAddrs);

    this.reserveContract = ierc20Abi; // The Standard ierc20Abi since they're normal tokens
  }
}
