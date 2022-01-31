import { useQuery } from "react-query";
import { parseBigNumber } from "src/helpers";
import { useStakingContract } from "src/hooks/useContract";

export const nextRebaseDate = () => ["useNextRebaseDate"];

export const useNextRebaseDate = () => {
  const contract = useStakingContract();

  return useQuery<Date, Error>(nextRebaseDate(), async () => {
    const secondsToRebase = await contract.secondsToNextEpoch();

    const parsedSeconds = parseBigNumber(secondsToRebase, 0);

    return new Date(Date.now() + parsedSeconds * 1000);
  });
};
