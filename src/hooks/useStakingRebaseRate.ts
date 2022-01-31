import { useQuery } from "react-query";
import { SOHM_CONTRACT_DECIMALS, STAKING_CONTRACT_DECIMALS } from "src/constants/decimals";
import { parseBigNumber, queryAssertion } from "src/helpers";

import { useSohmContract, useStakingContract } from "./useContract";

export const stakingRebaseRateQueryKey = () => ["useStakingRebaseRate"];

export const useStakingRebaseRate = () => {
  const sohmContract = useSohmContract();
  const stakingContract = useStakingContract();
  const stakingQuery = useQuery(["useStakingEpoch"], () => stakingContract.epoch());
  const sohmQuery = useQuery(["useSohmCirculatingSuppply"], () => sohmContract.circulatingSupply());

  return useQuery<number, Error>(
    stakingRebaseRateQueryKey(),
    async () => {
      queryAssertion(stakingQuery.data && sohmQuery.data, stakingRebaseRateQueryKey());

      return (
        parseBigNumber(stakingQuery.data.distribute, STAKING_CONTRACT_DECIMALS) /
        parseBigNumber(sohmQuery.data, SOHM_CONTRACT_DECIMALS)
      );
    },
    { enabled: !!stakingQuery.data && !!sohmQuery.data },
  );
};
