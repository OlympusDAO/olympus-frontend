import { useQuery } from "react-query";
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

      const circulatingSupply = parseBigNumber(sohmQuery.data);
      const stakingReward = parseBigNumber(stakingQuery.data.distribute);

      return stakingReward / circulatingSupply;
    },
    { enabled: !!stakingQuery.data && !!sohmQuery.data },
  );
};
