import { StaticJsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";

import { abi as ierc20Abi } from "src/abi/IERC20.json";

export enum NetworkID {
  Mainnet = 1,
  Testnet = 4,
}

export enum BondType {
  StableAsset,
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

interface BondOpts {
  name: string; // Internal name used for references
  displayName: string; // Displayname on UI
  bondIconSvg: string; //  SVG path for icons
  bondContractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
  bondToken: string; // Unused, but native token to buy the bond.
}

// Technically only exporting for the interface
export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly type: BondType;
  readonly bondIconSvg: string;
  readonly bondContractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: NetworkAddresses;
  readonly bondToken: string;

  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: Boolean;
  abstract reserveContract: ethers.ContractInterface; // Token ABI
  abstract displayUnits: string;

  constructor(type: BondType, bondOpts: BondOpts) {
    this.name = bondOpts.name;
    this.displayName = bondOpts.displayName;
    this.type = type;
    this.bondIconSvg = bondOpts.bondIconSvg;
    this.bondContractABI = bondOpts.bondContractABI;
    this.networkAddrs = bondOpts.networkAddrs;
    this.bondToken = bondOpts.bondToken;
  }

  getAddressForBond(networkID: NetworkID) {
    return this.networkAddrs[networkID].bondAddress;
  }
  getContractForBond(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForBond(networkID);
    return new ethers.Contract(bondAddress, this.bondContractABI, provider);
  }

  getAddressForReserve(networkID: NetworkID) {
    return this.networkAddrs[networkID].reserveAddress;
  }
  getContractForReserve(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(networkID);
    return new ethers.Contract(bondAddress, this.reserveContract, provider);
  }
}

// Keep all LP specific fields/logic within the LPBond class
export interface LPBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  lpUrl: string;
}

export class LPBond extends Bond {
  readonly isLP = true;
  readonly lpUrl: string;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(lpBondOpts: LPBondOpts) {
    super(BondType.LP, lpBondOpts);

    this.lpUrl = lpBondOpts.lpUrl;
    this.reserveContract = lpBondOpts.reserveContract;
    this.displayUnits = "LP";
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export interface StableBondOpts extends BondOpts {}
export class StableBond extends Bond {
  readonly isLP = false;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(stableBondOpts: StableBondOpts) {
    super(BondType.StableAsset, stableBondOpts);

    // For stable bonds the display units are the same as the actual token
    this.displayUnits = stableBondOpts.displayName;
    this.reserveContract = ierc20Abi; // The Standard ierc20Abi since they're normal tokens
  }
}
