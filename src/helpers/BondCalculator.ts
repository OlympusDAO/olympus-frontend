import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "src/lib/Bond";
import { abi as BondCalcContractABI } from "src/abi/BondCalcContract.json";
import { ethers, Signer } from "ethers";
import { addresses } from "src/constants";
import { BondCalcContract } from "../typechain";

export function getBondCalculator(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  const bondCalcContract: BondCalcContract = new ethers.Contract(
    addresses[networkID].BONDINGCALC_ADDRESS as string,
    BondCalcContractABI,
    provider,
  ) as BondCalcContract;

  return bondCalcContract;
}
