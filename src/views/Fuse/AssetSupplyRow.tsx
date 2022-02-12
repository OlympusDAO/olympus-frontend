import { Avatar, Grid, TableCell, TableRow, Tooltip, Typography } from "@material-ui/core";

import { convertMantissaToAPY } from "../../fuse-sdk/helpers/apyUtils";
import { USDPricedFuseAsset } from "../../fuse-sdk/helpers/fetchFusePoolData";
import { useTokenData } from "../../fuse-sdk/hooks/useTokenData";
import { formatCurrency } from "../../helpers";

export function AssetSupplyRow({
  asset,
  onClick,
}: {
  asset: USDPricedFuseAsset;
  onClick: (asset: USDPricedFuseAsset) => void;
}) {
  const tokenData = useTokenData(asset.underlyingToken);
  const supplyAPY = convertMantissaToAPY(asset.supplyRatePerBlock, 365);

  return (
    <TableRow hover onClick={() => onClick(asset)} className="asset-row">
      <TableCell>
        <Grid spacing={1} container alignItems="center">
          <Grid item>
            <Avatar
              className={"avatar-medium"}
              src={
                tokenData?.logoURL ??
                "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
              }
            />
          </Grid>
          <Grid item>
            <Typography>{tokenData?.symbol ?? asset.underlyingSymbol}</Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell align={"right"}>
        <>
          <Typography>{supplyAPY.toFixed(2)}%</Typography>

          <Tooltip
            arrow
            title={
              <Typography variant="h6">
                The Collateral Factor (CF) ratio defines the maximum amount of tokens in the pool that can be borrowed
                with a specific collateral. It’s expressed in percentage: if in a pool ETH has 75% LTV, for every 1 ETH
                worth of collateral, borrowers will be able to borrow 0.75 ETH worth of other tokens in the pool.
              </Typography>
            }
          >
            <Typography variant="body2" component="span">
              {asset.collateralFactor / 1e16}% LTV
            </Typography>
          </Tooltip>
        </>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body1">{formatCurrency(asset.supplyBalanceUSD, 2)}</Typography>
        <Typography variant="body2" component="span">
          {formatCurrency(asset.supplyBalance / 10 ** asset.underlyingDecimals, 2).replace("$", "")}{" "}
          {tokenData?.extraData?.shortName ?? tokenData?.symbol ?? asset.underlyingSymbol}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
