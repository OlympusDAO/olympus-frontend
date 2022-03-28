import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { parseBigNumber } from "src/helpers";
import { createDependentQuery } from "src/helpers/react-query/createDependentQuery";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";

import { useStaticSohmContract, useStaticStakingContract } from "./useContract";

export const stakingRebaseRateQueryKey = () => ["useStakingRebaseRate"];
export const useStakingRebaseRate = () => {
  const sohmContract = useStaticSohmContract(SOHM_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);
  const stakingContract = useStaticStakingContract(STAKING_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  const key = stakingRebaseRateQueryKey();

  // Get dependent data in parallel
  const useDependentQuery = createDependentQuery(key);
  const stakingEpoch = useDependentQuery("stakingEpoch", () => stakingContract.epoch());
  const sohmCirculatingSupply = useDependentQuery("sohmCirculatingSupply", () => sohmContract.circulatingSupply());

  return useQuery<number, Error>(
    key,
    async () => {
      queryAssertion(stakingEpoch && sohmCirculatingSupply, key);

      const circulatingSupply = parseBigNumber(sohmCirculatingSupply);
      const stakingReward = parseBigNumber(stakingEpoch.distribute);

      return stakingReward / circulatingSupply;
    },
    { enabled: !!stakingEpoch && !!sohmCirculatingSupply },
  );
};
