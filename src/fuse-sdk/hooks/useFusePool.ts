import { useQuery } from "react-query";

import { fetchPools, MergedPool } from "../helpers/fetchFusePool";
import { useRari } from "../helpers/RariContext";

const poolSort = (pools: MergedPool[]) => {
  return pools.sort((a, b) => {
    if (b.suppliedUSD > a.suppliedUSD) {
      return 1;
    }

    if (b.suppliedUSD < a.suppliedUSD) {
      return -1;
    }

    // They're equal, let's sort by pool number:
    return b.id > a.id ? 1 : -1;
  });
};

export const useFusePools = (): { pools: MergedPool[] | undefined } => {
  const { fuse, address } = useRari();

  const { data: pools } = useQuery(`${address} fusePoolList`, () => {
    return fetchPools({ fuse, address });
  });
  return { pools: pools ? poolSort(pools) : undefined };
};
