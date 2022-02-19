import Fuse from "../index";

export function filterOnlyObjectProperties(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => isNaN(k as any))) as any;
}

interface LensFusePool {
  blockPosted: string;
  name: string;
  creator: string;
  comptroller: string;
  timestampPosted: string;
}

interface LensFusePoolData {
  totalBorrow: string;
  totalSupply: string;
  underlyingSymbols: string[];
  underlyingTokens: string[];
  whitelistedAdmin: boolean;
}

export type LensPoolsWithData = [
  ids: string[],
  fusePools: LensFusePool[],
  fusePoolsData: LensFusePoolData[],
  errors: boolean[],
];

export interface MergedPool extends LensFusePoolData, LensFusePool {
  id: number;
  suppliedUSD: number;
  borrowedUSD: number;
}

export const fetchPools = async ({ fuse, address }: { fuse: Fuse; address: string }) => {
  const req = await fuse.contracts.FusePoolLens.getPublicPoolUsersWithData(0);
  const { 0: ids, 1: fusePools, 2: fusePoolsData, 3: errors }: LensPoolsWithData = await req;

  const ethPrice: number = await fuse.getEthUsdPriceBN();

  const merged: MergedPool[] = [];
  for (let i = 0; i < ids.length; i++) {
    const id = parseFloat(ids[i]);
    const fusePool = fusePools[i];
    const fusePoolData = fusePoolsData[i];

    const mergedPool = {
      id,
      suppliedUSD: (parseFloat(fusePoolData.totalSupply) / 1e18) * ethPrice,
      borrowedUSD: (parseFloat(fusePoolData.totalBorrow) / 1e18) * ethPrice,
      ...filterOnlyObjectProperties(fusePool),
      ...filterOnlyObjectProperties(fusePoolData),
    };

    merged.push(mergedPool);
  }

  return merged;
};
