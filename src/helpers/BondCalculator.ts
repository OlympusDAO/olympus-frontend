import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { abi as BondCalcContractABI } from "src/abi/BondCalcContract.json";
import { addresses, NetworkId } from "src/constants";

import { BondCalcContract } from "../typechain";

export const getBondCalculator = (NetworkId: NetworkId, provider: StaticJsonRpcProvider, v2Bond: boolean) => {
  const contractAddress = v2Bond ? addresses[NetworkId].BONDINGCALC_V2 : addresses[NetworkId].BONDINGCALC_ADDRESS;

  return new ethers.Contract(contractAddress as string, BondCalcContractABI, provider) as BondCalcContract;
};
