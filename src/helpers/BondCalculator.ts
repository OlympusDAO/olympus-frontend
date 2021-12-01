import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "src/lib/Bond";
import { abi as BondCalcContractABI } from "src/abi/BondCalcContract.json";
import { ethers } from "ethers";
import { addresses } from "src/constants";
import { BondCalcContract } from "../typechain";

export const getBondCalculator = (networkID: NetworkID, provider: StaticJsonRpcProvider) => {
  return new ethers.Contract(
    addresses[networkID].BONDINGCALC_ADDRESS as string,
    BondCalcContractABI,
    provider,
  ) as BondCalcContract;
};
