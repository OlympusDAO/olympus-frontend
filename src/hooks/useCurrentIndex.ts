import { formatUnits } from "@ethersproject/units";
import { useQuery } from "react-query";
import { useStakingContract } from "./useContract";

export const useCurrentIndexKey = () => ["useCurrentIndex"];

export const useCurrentIndex = () => {
  const stakingContract = useStakingContract();

  return useQuery<number, Error>(useCurrentIndexKey(), async () => {
    const currentIndex = await stakingContract.index();

    return parseFloat(formatUnits(currentIndex, "gwei"));
  });
};
