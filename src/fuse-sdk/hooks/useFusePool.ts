import { useQuery } from "react-query";

import { fetchPools, MergedPool } from "../helpers/fetchFusePool";
import { useRari } from "../helpers/RariContext";

export const useFusePools = (): { pools: MergedPool[] | undefined } => {
  const { fuse, address } = useRari();

  const { data: pools } = useQuery(`${address} fusePoolList`, () => {
    return fetchPools({ fuse, address });
  });
  return { pools };
};
