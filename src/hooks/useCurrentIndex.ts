import { BigNumber } from "@ethersproject/bignumber";
import { useQuery } from "react-query";

import { useStakingContract } from "./useContract";

export const currentIndexQueryKey = () => ["useCurrentIndex"];

export const useCurrentIndex = () => {
  const stakingContract = useStakingContract();

  return useQuery<BigNumber, Error>(currentIndexQueryKey(), () => stakingContract.index());
};
