import { TokenData } from "../hooks/useTokenData";
import Fuse from "../index";
import { createComptroller } from "./createComptroller";

export function filterOnlyObjectProperties(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => isNaN(k as any))) as any;
}

export interface FuseAsset {
  cToken: string;

  borrowBalance: number;
  supplyBalance: number;
  liquidity: number;

  membership: boolean;

  underlyingName: string;
  underlyingSymbol: string;
  underlyingToken: string;
  underlyingDecimals: number;
  underlyingPrice: number;
  underlyingBalance: number;

  collateralFactor: number;
  reserveFactor: number;

  adminFee: number;
  fuseFee: number;
  oracle: string;

  borrowRatePerBlock: number;
  supplyRatePerBlock: number;

  totalBorrow: number;
  totalSupply: number;
}

export interface USDPricedFuseAsset extends FuseAsset {
  supplyBalanceUSD: number;
  borrowBalanceUSD: number;

  totalSupplyUSD: number;
  totalBorrowUSD: number;

  liquidityUSD: number;

  isPaused: boolean;
}

export interface USDPricedFuseAssetWithTokenData extends USDPricedFuseAsset {
  tokenData: TokenData;
}

export interface FusePoolData {
  assets: USDPricedFuseAssetWithTokenData[] | USDPricedFuseAsset[];
  comptroller: any;
  name: any;
  oracle: string;
  oracleModel: string | undefined;
  isPrivate: boolean;
  totalLiquidityUSD: any;
  totalSuppliedUSD: any;
  totalBorrowedUSD: any;
  totalSupplyBalanceUSD: any;
  totalBorrowBalanceUSD: any;
  id?: number;
}

export enum FusePoolMetric {
  TotalLiquidityUSD,
  TotalSuppliedUSD,
  TotalBorrowedUSD,
}

export const fetchFusePoolData = async (
  poolId: number | undefined,
  address: string,
  fuse: Fuse,
): Promise<FusePoolData | undefined> => {
  if (!poolId) return undefined;
  const { comptroller, name, isPrivate } = await fuse.contracts.FusePoolDirectory.pools(poolId, { from: address });

  const assets: USDPricedFuseAsset[] = (
    await fuse.contracts.FusePoolLens.callStatic.getPoolAssetsWithData(comptroller, { from: address })
  ).map(filterOnlyObjectProperties);

  let totalLiquidityUSD = 0;

  let totalSupplyBalanceUSD = 0;
  let totalBorrowBalanceUSD = 0;

  let totalSuppliedUSD = 0;
  let totalBorrowedUSD = 0;

  const ethPrice: number = await fuse.getEthUsdPriceBN();

  const promises = [];
  const comptrollerContract = createComptroller(comptroller, fuse);

  const oracle: string = await comptrollerContract.oracle();

  const oracleModel: string | undefined = await fuse.getPriceOracle(oracle);

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];

    promises.push(
      comptrollerContract
        .borrowGuardianPaused(asset.cToken)
        // TODO: THIS WILL BE BUILT INTO THE LENS
        .then((isPaused: boolean) => (asset.isPaused = isPaused)),
    );

    asset.supplyBalanceUSD = ((asset.supplyBalance * asset.underlyingPrice) / 1e36) * ethPrice;
    asset.borrowBalanceUSD = ((asset.borrowBalance * asset.underlyingPrice) / 1e36) * ethPrice;

    totalSupplyBalanceUSD += asset.supplyBalanceUSD;
    totalBorrowBalanceUSD += asset.borrowBalanceUSD;

    asset.totalSupplyUSD = ((asset.totalSupply * asset.underlyingPrice) / 1e36) * ethPrice;
    asset.totalBorrowUSD = ((asset.totalBorrow * asset.underlyingPrice) / 1e36) * ethPrice;

    totalSuppliedUSD += asset.totalSupplyUSD;
    totalBorrowedUSD += asset.totalBorrowUSD;

    asset.liquidityUSD = ((asset.liquidity * asset.underlyingPrice) / 1e36) * ethPrice;

    totalLiquidityUSD += asset.liquidityUSD;
  }

  await Promise.all(promises);

  return {
    assets: assets.sort((a, b) => (b.liquidityUSD > a.liquidityUSD ? 1 : -1)),
    comptroller,
    name,
    isPrivate,
    oracle,
    oracleModel,

    totalLiquidityUSD,

    totalSuppliedUSD,
    totalBorrowedUSD,

    totalSupplyBalanceUSD,
    totalBorrowBalanceUSD,
  };
};
