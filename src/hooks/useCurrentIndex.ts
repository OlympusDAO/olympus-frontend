import { BigNumber } from "@ethersproject/bignumber";
import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { STAKING_ADDRESSES } from "src/constants/addresses";

import { useStakingContract } from "./useContract";
import { useStaticProvider } from "./useStaticProvider";

export const currentIndexQueryKey = () => ["useCurrentIndex"];

export const useCurrentIndex = () => {
  const provider = useStaticProvider(NetworkId.MAINNET);
  const stakingContract = useStakingContract(STAKING_ADDRESSES[NetworkId.MAINNET], provider);

  return useQuery<BigNumber, Error>(currentIndexQueryKey(), () => stakingContract.index());
};
