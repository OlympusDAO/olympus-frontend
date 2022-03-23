import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { STAKING_ADDRESSES } from "src/constants/addresses";
import { parseBigNumber } from "src/helpers";
import { useStaticStakingContract } from "src/hooks/useContract";

export const nextRebaseDateQueryKey = () => ["useNextRebaseDate"];

export const useNextRebaseDate = () => {
  const contract = useStaticStakingContract(STAKING_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  const key = nextRebaseDateQueryKey();
  return useQuery<Date, Error>(key, async () => {
    const secondsToRebase = await contract.secondsToNextEpoch();

    const parsedSeconds = parseBigNumber(secondsToRebase, 0);

    return new Date(Date.now() + parsedSeconds * 1000);
  });
};
