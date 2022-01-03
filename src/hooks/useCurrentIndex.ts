import { formatUnits } from "@ethersproject/units";
import { useQuery } from "react-query";
import { queryAssertion } from "src/helpers";
import { useStakingContract } from "./useContract";

export const useCurrentIndexKey = () => ["useCurrentIndex"];

export const useCurrentIndex = () => {
  const stakingContract = useStakingContract();

  return useQuery<number, Error>(
    useCurrentIndexKey(),
    async () => {
      queryAssertion(stakingContract, useCurrentIndexKey());

      const currentIndex = await stakingContract.index();

      return parseFloat(formatUnits(currentIndex));
    },
    { enabled: !!stakingContract },
  );
};
