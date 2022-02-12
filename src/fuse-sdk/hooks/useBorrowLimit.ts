import { useMemo } from "react";

import { USDPricedFuseAsset } from "../helpers/fetchFusePoolData";

export const useBorrowLimit = (assets: USDPricedFuseAsset[], options?: { ignoreIsEnabledCheckFor: string }) => {
  const maxBorrow = useMemo(() => {
    let maxBorrow = 0;
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];

      if (options?.ignoreIsEnabledCheckFor === asset.cToken || asset.membership) {
        maxBorrow += asset.supplyBalanceUSD * (asset.collateralFactor / 1e18);
      }
    }
    return maxBorrow;
  }, [assets, options?.ignoreIsEnabledCheckFor]);

  return maxBorrow;
};

export const useBorrowLimits = (
  assetsArray: USDPricedFuseAsset[][] | null,
  options?: { ignoreIsEnabledCheckFor: string },
) => {
  const maxBorrows = useMemo(() => {
    return assetsArray?.map(assets => {
      let maxBorrow = 0;
      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];

        if (options?.ignoreIsEnabledCheckFor === asset.cToken || asset.membership) {
          maxBorrow += asset.supplyBalanceUSD * (asset.collateralFactor / 1e18);
        }
      }
      return maxBorrow;
    });
  }, [assetsArray, options?.ignoreIsEnabledCheckFor]);

  return maxBorrows;
};
