import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { NetworkId } from "src/constants";
import { STAKING_CONTRACT } from "src/constants/contracts";

//Returns True if a rebase needs to be called.
export const useCheckSecondsToNextEpoch = () => {
  return useQuery(["checkSecondsToNextEpoch"], async () => {
    const stakingContract = STAKING_CONTRACT.getEthersContract(NetworkId.MAINNET);
    const nextEpoch = await stakingContract.secondsToNextEpoch().catch(error => {
      //contract will throw an error if the current block time is past the next epoch time.
      if (error.code === ethers.errors.CALL_EXCEPTION) {
        if (error.reason.includes("SafeMath: subtraction overflow")) {
          return BigNumber.from("0");
        }
      }
      //If we're here we don't know why this reverted so return a positive number so we don't try to trigger a rebase.
      return BigNumber.from("1");
    });

    console.log(nextEpoch, "nextEpoch");

    if (nextEpoch.toNumber() === 0) {
      return true;
    }
    return false;
  });
};
