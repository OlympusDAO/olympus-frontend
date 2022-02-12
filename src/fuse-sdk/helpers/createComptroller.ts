// Fuse
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";

import { abi as ERC20ABI } from "../../abi/IERC20.json";
import Fuse from "../index";

export const createComptroller = (comptrollerAddress: string, fuse: Fuse): Contract => {
  return new ethers.Contract(
    comptrollerAddress,
    JSON.parse(fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi),
    fuse.provider,
  );
};

export const createUnitroller = (unitrollerAddress: string, fuse: Fuse): Contract => {
  return new ethers.Contract(
    unitrollerAddress,
    JSON.parse(fuse.compoundContracts["contracts/Unitroller.sol:Unitroller"].abi),
    fuse.provider,
  );
};

export const createRewardsDistributor = (distributorAddress: string, fuse: Fuse) => {
  //   Create instance of contract
  return new ethers.Contract(
    distributorAddress,
    JSON.parse(fuse.compoundContracts["contracts/RewardsDistributorDelegate.sol:RewardsDistributorDelegate"].abi),
    fuse.provider,
  );
};

export const createOracle = (oracleAddress: string, fuse: Fuse, type: string): Contract => {
  // @ts-ignore
  return new ethers.Contract(oracleAddress, fuse.oracleContracts[type].abi, fuse.provider);
};

export const createCToken = (fuse: Fuse, cTokenAddress: string) => {
  return new ethers.Contract(
    cTokenAddress,
    JSON.parse(fuse.compoundContracts["contracts/CErc20Delegate.sol:CErc20Delegate"].abi),
    fuse.provider,
  );
};

export const createERC20 = (fuse: Fuse, cTokenAddress: string) => {
  return new ethers.Contract(cTokenAddress, ERC20ABI as any, fuse.provider);
};

export const createMasterPriceOracle = (fuse: Fuse) => {
  return new ethers.Contract(
    Fuse.PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESSES.MasterPriceOracle,
    fuse.oracleContracts["MasterPriceOracle"].abi,
    fuse.provider,
  );
};
