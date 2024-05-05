import { useProvider, useQuery } from "wagmi";

export const useGetCurrentBlockTime = () => {
  const archiveProvider = useProvider();
  return useQuery(["getCurrentBlockTime"], async () => {
    const blockTime = await archiveProvider.getBlock("latest");
    return blockTime;
  });
};
