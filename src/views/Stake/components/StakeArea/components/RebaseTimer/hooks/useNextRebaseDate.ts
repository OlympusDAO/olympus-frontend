import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { STAKING_ADDRESSES } from "src/constants/addresses";
import { parseBigNumber } from "src/helpers";
import { useStakingContract } from "src/hooks/useContract";
import { useStaticProvider } from "src/hooks/useStaticProvider";

export const nextRebaseDateQueryKey = () => ["useNextRebaseDate"];

export const useNextRebaseDate = () => {
  const provider = useStaticProvider(NetworkId.MAINNET);
  const contract = useStakingContract(STAKING_ADDRESSES[NetworkId.MAINNET], provider);

  return useQuery<Date, Error>(nextRebaseDateQueryKey(), async () => {
    const secondsToRebase = await contract.secondsToNextEpoch();

    const parsedSeconds = parseBigNumber(secondsToRebase, 0);

    return new Date(Date.now() + parsedSeconds * 1000);
  });
};
