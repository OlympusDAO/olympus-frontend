import { CircularProgress, Grid, Typography } from "@material-ui/core";
import { useQuery, UseQueryResult } from "react-query";
import { useRari } from "src/fuse-sdk/helpers/RariContext";

import { convertMantissaToAPR, convertMantissaToAPY } from "../../../fuse-sdk/helpers/apyUtils";
import { USDPricedFuseAsset } from "../../../fuse-sdk/helpers/fetchFusePoolData";
import { Mode } from "../../../fuse-sdk/helpers/fetchMaxAmount";
import { formatCurrency } from "../../../helpers";

export const StatsColumn = ({
  mode,
  asset,
  amount,
  symbol,
  enableAsCollateral,
  borrowLimit,
}: {
  mode: Mode;
  asset: USDPricedFuseAsset;
  amount: number;
  symbol: string;
  enableAsCollateral: boolean;
  borrowLimit: number;
}) => {
  const { fuse } = useRari();

  const { data: updatedAsset = asset }: UseQueryResult<USDPricedFuseAsset> = useQuery(
    `${mode} ${JSON.stringify(asset)} ${amount}`,
    async () => {
      const ethPrice = Number(await fuse.getEthUsdPriceBN());

      const interestRateModel = await fuse.getInterestRateModel(asset.cToken);

      if (mode === Mode.SUPPLY) {
        const supplyBalance = Number(asset.supplyBalance) + amount;
        const totalSupply = Number(asset.totalSupply) + amount;

        return {
          ...asset,
          supplyBalance,
          supplyBalanceUSD: ((supplyBalance * asset.underlyingPrice) / 1e36) * ethPrice,

          totalSupply,
          supplyRatePerBlock: interestRateModel.getSupplyRate(
            totalSupply > 0 ? (1e18 * asset.totalBorrow) / totalSupply : 0,
          ),
        };
      } else if (mode === Mode.WITHDRAW) {
        const supplyBalance = Number(asset.supplyBalance) - amount;

        const totalSupply = Number(asset.totalSupply) - amount;

        return {
          ...asset,

          supplyBalance,
          supplyBalanceUSD: ((supplyBalance * asset.underlyingPrice) / 1e36) * ethPrice,

          totalSupply,
          supplyRatePerBlock: interestRateModel.getSupplyRate(
            totalSupply > 0 ? (1e18 * asset.totalBorrow) / totalSupply : 0,
          ),
        };
      } else if (mode === Mode.BORROW) {
        const borrowBalance = Number(asset.borrowBalance) + amount;

        const totalBorrow = Number(asset.totalBorrow) + amount;

        return {
          ...asset,

          borrowBalance,
          borrowBalanceUSD: ((borrowBalance * asset.underlyingPrice) / 1e36) * ethPrice,

          totalBorrow,
          borrowRatePerBlock: interestRateModel.getBorrowRate(
            asset.totalSupply > 0 ? (1e18 * totalBorrow) / asset.totalSupply : 0,
          ),
        };
      } else if (mode === Mode.REPAY) {
        const borrowBalance = Number(asset.borrowBalance) - amount;

        const totalBorrow = Number(asset.totalBorrow) - amount;

        return {
          ...asset,

          borrowBalance,
          borrowBalanceUSD: ((borrowBalance * asset.underlyingPrice) / 1e36) * ethPrice,

          totalBorrow,
          borrowRatePerBlock: interestRateModel.getBorrowRate(
            asset.totalSupply > 0 ? (1e18 * totalBorrow) / asset.totalSupply : 0,
          ),
        };
      }
    },
  );

  const updatedBorrowLimit = enableAsCollateral
    ? updatedAsset.supplyBalanceUSD * (updatedAsset.collateralFactor / 1e18)
    : Math.max(
        0,
        borrowLimit -
          asset.supplyBalanceUSD * (asset.collateralFactor / 1e18) +
          updatedAsset.supplyBalanceUSD * (updatedAsset.collateralFactor / 1e18),
      );

  const isSupplyingOrWithdrawing = mode === Mode.SUPPLY || mode === Mode.WITHDRAW;

  const supplyAPY = convertMantissaToAPY(asset.supplyRatePerBlock, 365);
  const borrowAPR = convertMantissaToAPR(asset.borrowRatePerBlock);

  const updatedSupplyAPY = convertMantissaToAPY(updatedAsset?.supplyRatePerBlock ?? 0, 365);
  const updatedBorrowAPR = convertMantissaToAPR(updatedAsset?.borrowRatePerBlock ?? 0);

  // If the difference is greater than a 0.1 percentage point change, alert the user
  const updatedAPYDiffIsLarge = isSupplyingOrWithdrawing
    ? Math.abs(updatedSupplyAPY - supplyAPY) > 0.1
    : Math.abs(updatedBorrowAPR - borrowAPR) > 0.1;

  return (
    <Grid item>
      {updatedAsset ? (
        <Grid container direction="column" spacing={2}>
          <StatsColumnRow
            left="Supply Balance"
            right={
              <>
                {formatCurrency(asset.supplyBalance / 10 ** asset.underlyingDecimals, 2).replace("$", "")}
                {isSupplyingOrWithdrawing ? (
                  <>
                    {" → "}
                    {formatCurrency(
                      Math.max(0, updatedAsset.supplyBalance) / 10 ** updatedAsset.underlyingDecimals,
                      2,
                    ).replace("$", "")}
                  </>
                ) : null}{" "}
                {symbol}
              </>
            }
          />

          <StatsColumnRow
            left={isSupplyingOrWithdrawing ? "Supply APY" : "Borrow APR"}
            right={
              <>
                {isSupplyingOrWithdrawing ? supplyAPY.toFixed(2) : borrowAPR.toFixed(2)}%
                {updatedAPYDiffIsLarge ? (
                  <>
                    {" → "}
                    {isSupplyingOrWithdrawing ? updatedSupplyAPY.toFixed(2) : updatedBorrowAPR.toFixed(2)}%
                  </>
                ) : null}
              </>
            }
          />
          <StatsColumnRow
            left="Borrow Limit"
            right={
              <>
                {formatCurrency(borrowLimit, 2)}
                {isSupplyingOrWithdrawing ? (
                  <>
                    {" → "} {formatCurrency(updatedBorrowLimit, 2)}
                  </>
                ) : null}{" "}
              </>
            }
          />
          <StatsColumnRow
            left="Debt Balance"
            right={
              <>
                {formatCurrency(asset.borrowBalanceUSD, 2)}
                {!isSupplyingOrWithdrawing ? (
                  <>
                    {" → "}
                    {formatCurrency(Math.max(0, updatedAsset.borrowBalanceUSD), 2)}
                  </>
                ) : null}
              </>
            }
          />
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
};

const StatsColumnRow = ({ left, right }: { left: string; right: React.ReactNode }) => {
  return (
    <Grid item container justifyContent="space-between" alignItems="baseline">
      <Grid item>
        <Typography>{left}:</Typography>
      </Grid>
      <Grid item>
        <Typography>{right}</Typography>
      </Grid>
    </Grid>
  );
};
