import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "src/lib/Bond";
import { abi as BondCalcContract } from "src/abi/BondCalcContract.json";
import { ethers } from "ethers";
import { addresses } from "src/constants";

export function getBondCalculator(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  return new ethers.Contract(addresses[networkID].BONDINGCALC_ADDRESS as string, BondCalcContract, provider);
}
