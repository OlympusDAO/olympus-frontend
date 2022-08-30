import { useQuery } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { STAKING_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useStaticStakingContract } from "src/hooks/useContract";

export const currentIndexQueryKey = () => ["useCurrentIndex"];

export const useCurrentIndex = () => {
  const stakingContract = useStaticStakingContract(STAKING_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  return useQuery<DecimalBigNumber, Error>([currentIndexQueryKey()], async () => {
    const index = await stakingContract.index();

    return new DecimalBigNumber(index, 9);
  });
};
