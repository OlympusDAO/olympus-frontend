import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { createDependentQuery, parseBigNumber, queryAssertion } from "src/helpers";

import { useSohmContract, useStakingContract } from "./useContract";
import { useStaticProvider } from "./useStaticProvider";

export const stakingRebaseRateQueryKey = () => ["useStakingRebaseRate"];
export const useStakingRebaseRate = () => {
  const provider = useStaticProvider(NetworkId.MAINNET);

  const sohmContract = useSohmContract(SOHM_ADDRESSES[NetworkId.MAINNET], provider);
  const stakingContract = useStakingContract(STAKING_ADDRESSES[NetworkId.MAINNET], provider);

  // Get dependent data in parallel
  const useDependentQuery = createDependentQuery(stakingRebaseRateQueryKey());
  const stakingEpoch = useDependentQuery("stakingEpoch", () => stakingContract.epoch());
  const sohmCirculatingSupply = useDependentQuery("sohmCirculatingSupply", () => sohmContract.circulatingSupply());

  return useQuery<number, Error>(
    stakingRebaseRateQueryKey(),
    async () => {
      queryAssertion(stakingEpoch && sohmCirculatingSupply, stakingRebaseRateQueryKey());

      const circulatingSupply = parseBigNumber(sohmCirculatingSupply);
      const stakingReward = parseBigNumber(stakingEpoch.distribute);

      return stakingReward / circulatingSupply;
    },
    { enabled: !!stakingEpoch && !!sohmCirculatingSupply },
  );
};
