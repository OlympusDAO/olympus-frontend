import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { NetworkId } from "src/constants";
import { STAKING_ADDRESSES } from "src/constants/addresses";
import { parseBigNumber } from "src/helpers";
import { useStaticStakingContract } from "src/hooks/useContract";
import { useEpochLength, useWarmupPeriod } from "src/hooks/useWarmupInfo";

export const useNextRebaseDate = () => {
  const { data: secondsToRebase, isSuccess } = useNextRebase();
  const parsedSeconds = parseBigNumber(secondsToRebase || BigNumber.from("0"), 0);
  const dateTime = new Date(Date.now() + parsedSeconds * 1000);
  return {
    data: isSuccess ? dateTime : undefined,
  };
};

/**
 * @returns JS Date for next warmup completion
 */
export const useNextWarmupDate = () => {
  const { data: secondsToRebase, isSuccess: rebaseSuccess } = useNextRebase();
  const { data: warmupEpochs, isSuccess: warmupSuccess } = useWarmupPeriod();
  const { data: epochLength, isSuccess: epochSuccess } = useEpochLength();
  const isSuccess = rebaseSuccess && warmupSuccess && epochSuccess;

  const parsedSeconds = parseBigNumber(secondsToRebase || BigNumber.from("0"), 0);
  const epochLengthSeconds = parseBigNumber(epochLength?.toBigNumber() || BigNumber.from("0"), 0);
  const warmupLength = parseBigNumber(warmupEpochs?.toBigNumber() || BigNumber.from("0"), 0);

  // secondsRemainingInThisEpoch + (epochLenghInSeconds * numberOfEpochsInWarmup)
  const dateTime = new Date(Date.now() + (parsedSeconds + epochLengthSeconds * warmupLength) * 1000);

  return {
    data: isSuccess ? dateTime : undefined,
  };
};

export const useNextRebase = () => {
  const contract = useStaticStakingContract(STAKING_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  return useQuery<BigNumber, Error>(["secondsToNextRebase"], async () => {
    const secondsToRebase = await contract.secondsToNextEpoch();

    return secondsToRebase;
  });
};
