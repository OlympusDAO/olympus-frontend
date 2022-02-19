import "./Fuse.scss";

import { t } from "@lingui/macro";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  Zoom,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { InfoTooltip, Metric, MetricCollection, Paper, TertiaryButton, Token } from "@olympusdao/component-library";
import { useCallback, useMemo, useState } from "react";
import { useBorrowLimit } from "src/fuse-sdk/hooks/useBorrowLimit";

import { convertMantissaToAPY } from "../../fuse-sdk/helpers/apyUtils";
import { USDPricedFuseAsset } from "../../fuse-sdk/helpers/fetchFusePoolData";
import { Mode } from "../../fuse-sdk/helpers/fetchMaxAmount";
import { useFusePoolData } from "../../fuse-sdk/hooks/useFusePoolData";
import { useTokenData } from "../../fuse-sdk/hooks/useTokenData";
import { formatCurrency } from "../../helpers";
import { useWeb3Context } from "../../hooks/web3Context";
import { AssetAndOtherInfo } from "./AssetAndOtherInfo";
import { CollateralRatioBar } from "./CollateralRatioBar";
import FuseDataCard from "./FuseDataCard";
import { PoolModal } from "./Modal/PoolModal";

export default function Borrow({ poolId }: { poolId: number }) {
  const data = useFusePoolData(poolId);
  const { connect, connected } = useWeb3Context();
  const {
    totalSuppliedUSD,
    totalBorrowedUSD,
    totalLiquidityUSD,
    totalSupplyBalanceUSD,
    totalBorrowBalanceUSD,
    comptroller: comptrollerAddress,
    assets = [],
  } = data ?? {};
  const suppliedAssets = useMemo(() => assets.filter(asset => asset.supplyBalanceUSD > 1), [assets]);
  const nonSuppliedAssets = useMemo(() => assets.filter(asset => asset.supplyBalanceUSD < 1), [assets]);

  const borrowedAssets = useMemo(() => assets.filter(asset => asset.borrowBalanceUSD > 1), [assets]);
  const nonBorrowedAssets = useMemo(() => assets.filter(asset => asset.borrowBalanceUSD < 1), [assets]);

  const maxBorrow = useBorrowLimit(assets);

  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const utilization =
    (totalSuppliedUSD ?? 0).toString() === "0"
      ? "0%"
      : (((totalBorrowedUSD ?? 0) / totalSuppliedUSD) * 100).toFixed(2) + "%";

  const [selectedAsset, setSelectedAsset] = useState<USDPricedFuseAsset | null>(null);
  const [defaultMode, setDefaultMode] = useState(Mode.SUPPLY);
  const handleOpen = useCallback(
    (asset, mode) => {
      if (!connected) {
        connect();
        return;
      }
      setSelectedAsset(asset);
      setDefaultMode(mode);
    },
    [connect, connected],
  );
  const handleClose = useCallback(() => setSelectedAsset(null), []);

  return (
    <Zoom in={true}>
      <div id="fuse-view">
        <Paper fullWidth headerText={`Pool ${poolId}`}>
          <MetricCollection>
            <Metric
              label={t`Total Supply`}
              metric={formatCurrency(totalSuppliedUSD, 2)}
              isLoading={!!totalSuppliedUSD ? false : true}
            />
            <Metric
              label={t`Total Borrow`}
              metric={formatCurrency(totalBorrowedUSD, 2)}
              isLoading={!!totalBorrowedUSD ? false : true}
            />
            <Metric
              label={t`Liquidity`}
              metric={formatCurrency(totalLiquidityUSD, 2)}
              isLoading={!!totalLiquidityUSD ? false : true}
            />
            <Metric label={t`Supply Utilization`} metric={utilization} isLoading={!!utilization ? false : true} />
          </MetricCollection>
        </Paper>
        {assets.some(asset => asset.membership) ? (
          <Paper fullWidth>
            <CollateralRatioBar maxBorrow={maxBorrow} borrowUSD={totalBorrowBalanceUSD} />{" "}
          </Paper>
        ) : null}
        {!isSmallScreen && (
          <Paper fullWidth>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell align="right">APY/LTV</TableCell>
                    <TableCell align="right">APR/TVL</TableCell>
                    <TableCell align="right">Supply balance</TableCell>
                    <TableCell align="right">Borrow balance</TableCell>
                    <TableCell align="right">Liquidity</TableCell>
                    <TableCell colSpan={2} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.length ? (
                    assets.map(asset => <AssetRow asset={asset} key={asset.cToken} onClick={handleOpen} />)
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Skeleton height={300} variant="rect" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {isSmallScreen &&
          assets.length > 0 &&
          assets.map((a, i) => <FuseDataCard asset={a} key={i} onClick={handleOpen} />)}

        <AssetAndOtherInfo assets={assets} />

        {selectedAsset ? (
          <PoolModal
            defaultMode={defaultMode}
            comptrollerAddress={comptrollerAddress}
            asset={selectedAsset}
            onClose={handleClose}
            borrowLimit={maxBorrow}
          />
        ) : null}
      </div>
    </Zoom>
  );
}

function AssetRow({
  asset,
  onClick,
}: {
  asset: USDPricedFuseAsset;
  onClick: (asset: USDPricedFuseAsset, mode: Mode) => void;
}) {
  const tokenData = useTokenData(asset.underlyingToken);

  const supplyAPY = convertMantissaToAPY(asset.supplyRatePerBlock, 365);
  const borrowAPR = convertMantissaToAPY(asset.borrowRatePerBlock, 365);

  const handleSupplyClick = useCallback(() => onClick(asset, Mode.SUPPLY), [asset, onClick]);
  const handleBorrowClick = useCallback(() => onClick(asset, Mode.BORROW), [asset, onClick]);

  return (
    <TableRow>
      <TableCell>
        <Grid spacing={1} container alignItems="center">
          <Grid item>
            {/* @ts-ignore */}
            <Token name={asset.underlyingName} />
          </Grid>
          <Grid item>
            <Typography>{tokenData?.symbol ?? asset.underlyingSymbol}</Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell align={"right"}>
        <>
          <Typography>{supplyAPY.toFixed(2)}%</Typography>
          <Typography variant="body2" component="span">
            {asset.collateralFactor / 1e16}% LTV
          </Typography>
          <InfoTooltip
            message={`The Collateral Factor (CF) ratio defines the maximum amount of tokens in the pool that can be borrowed with a specific collateral. It’s expressed in percentage: if in a pool ETH has 75% LTV, for every 1 ETH worth of collateral, borrowers will be able to borrow 0.75 ETH worth of other tokens in the pool.`}
          ></InfoTooltip>
        </>
      </TableCell>
      {asset.isPaused ? (
        <TableCell align={"right"}>-</TableCell>
      ) : (
        <TableCell align={"right"}>
          <Typography variant="body1">{borrowAPR.toFixed(2)}%</Typography>
          <Typography variant="body2" component="span">{`${shortUsdFormatter(asset.totalSupplyUSD)} TVL`}</Typography>
          <InfoTooltip
            message={`Total Value Lent (TVL) measures how much of this asset has been supplied in total. TVL does not account for how much of the lent assets have been borrowed, use 'liquidity' to determine the total unborrowed assets lent.`}
          ></InfoTooltip>
        </TableCell>
      )}
      <TableCell align="right">
        <Typography variant="body1">{formatCurrency(asset.supplyBalanceUSD, 2)}</Typography>
        <Typography variant="body2" component="span">
          {formatCurrency(asset.supplyBalance / 10 ** asset.underlyingDecimals, 2).replace("$", "")}{" "}
          {tokenData?.extraData?.shortName ?? tokenData?.symbol ?? asset.underlyingSymbol}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body1">{formatCurrency(asset.borrowBalanceUSD, 2)}</Typography>
        <Typography variant="body2" component="span">
          {formatCurrency(asset.borrowBalance / 10 ** asset.underlyingDecimals, 2).replace("$", "")}{" "}
          {tokenData?.extraData?.shortName ?? tokenData?.symbol ?? asset.underlyingSymbol}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body1">{shortUsdFormatter(asset.liquidityUSD)}</Typography>
        <Typography variant="body2" component="span">
          {shortUsdFormatter(asset.liquidity / 10 ** asset.underlyingDecimals).replace("$", "")} {tokenData?.symbol}
        </Typography>
        <InfoTooltip
          message={`Liquidity is the amount of this asset that is available to borrow (unborrowed). To see how much has been supplied and borrowed in total, navigate to the Pool Info tab.`}
        />
      </TableCell>
      <TableCell>
        <TertiaryButton fullWidth onClick={handleSupplyClick}>
          Supply
        </TertiaryButton>
      </TableCell>
      <TableCell>
        <TertiaryButton fullWidth disabled={asset.isPaused} onClick={handleBorrowClick}>
          Borrow
        </TertiaryButton>
      </TableCell>
    </TableRow>
  );
}

export function shortUsdFormatter(num: number) {
  return `$${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(num)}`;
}
