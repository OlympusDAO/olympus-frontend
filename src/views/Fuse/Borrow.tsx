import "./borrow.scss";

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useCallback, useMemo, useState } from "react";
import { useBorrowLimit } from "src/fuse-sdk/hooks/useBorrowLimit";

import { USDPricedFuseAsset } from "../../fuse-sdk/helpers/fetchFusePoolData";
import { Mode } from "../../fuse-sdk/helpers/fetchMaxAmount";
import { useFusePoolData } from "../../fuse-sdk/hooks/useFusePoolData";
import { formatCurrency } from "../../helpers";
import { useWeb3Context } from "../../hooks/web3Context";
import { AssetAndOtherInfo } from "./AssetAndOtherInfo";
import { AssetBorrowRow } from "./AssetBorrowRow";
import { AssetSupplyRow } from "./AssetSupplyRow";
import { CollateralRatioBar } from "./CollateralRatioBar";
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
    <div id="borrow-view">
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Typography variant="h2">Hector Bank</Typography>
        </Grid>
        <Grid item container>
          <Paper className="hec-card">
            <Grid container spacing={1} className="hero-metrics" justifyContent="center">
              <Grid item xs={6} sm={3}>
                <TotalCard title="Total Supply" value={totalSuppliedUSD} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TotalCard title="Total Borrow" value={totalBorrowedUSD} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TotalCard title="Liquidity" value={totalLiquidityUSD} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TotalCard title="Supply Utilization" value={utilization} />
              </Grid>
            </Grid>
            {assets.some(asset => asset.membership) ? (
              <CollateralRatioBar maxBorrow={maxBorrow} borrowUSD={totalBorrowBalanceUSD} />
            ) : null}
          </Paper>
        </Grid>

        <Grid item container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Paper className="hec-card hec-card-table">
              {assets.length ? (
                <SupplyList
                  totalSupplyBalanceUSD={totalSupplyBalanceUSD}
                  suppliedAssets={suppliedAssets}
                  nonSuppliedAssets={nonSuppliedAssets}
                  onClick={handleOpen}
                />
              ) : (
                <Skeleton variant="rect" height={300} />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className="hec-card hec-card-table">
              {assets.length ? (
                <BorrowList
                  borrowedAssets={borrowedAssets}
                  nonBorrowedAssets={nonBorrowedAssets}
                  totalBorrowBalanceUSD={totalBorrowBalanceUSD}
                  onClick={handleOpen}
                />
              ) : (
                <Skeleton variant="rect" height={300} />
              )}
            </Paper>
          </Grid>
        </Grid>
        <Grid item>
          <Paper className="hec-card">
            {assets.length > 0 ? <AssetAndOtherInfo assets={assets} /> : <Skeleton variant="rect" height={300} />}
          </Paper>
        </Grid>
      </Grid>
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
  );
}

function SupplyList({
  totalSupplyBalanceUSD,
  suppliedAssets,
  nonSuppliedAssets,
  onClick,
}: {
  totalSupplyBalanceUSD: number;
  suppliedAssets: USDPricedFuseAsset[];
  nonSuppliedAssets: USDPricedFuseAsset[];
  onClick: (asset: USDPricedFuseAsset, mode: Mode) => void;
}) {
  const handleClick = useCallback(asset => onClick(asset, Mode.SUPPLY), []);
  return (
    <>
      <Typography variant="h5">Your Supply Balance: {formatCurrency(totalSupplyBalanceUSD, 2)}</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell align="right">APY/LTV</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliedAssets.map(asset => (
              <AssetSupplyRow key={asset.underlyingToken} asset={asset} onClick={handleClick} />
            ))}

            {nonSuppliedAssets.map(asset => (
              <AssetSupplyRow key={asset.underlyingToken} asset={asset} onClick={handleClick} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function BorrowList({
  borrowedAssets,
  nonBorrowedAssets,
  totalBorrowBalanceUSD,
  onClick,
}: {
  borrowedAssets: USDPricedFuseAsset[];
  nonBorrowedAssets: USDPricedFuseAsset[];
  totalBorrowBalanceUSD: number;
  onClick: (asset: USDPricedFuseAsset, mode: Mode) => void;
}) {
  const handleClick = useCallback(asset => onClick(asset, Mode.BORROW), []);
  return (
    <>
      <Typography variant="h5"> Your Borrow Balance: {formatCurrency(totalBorrowBalanceUSD, 2)}</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell align="right">APR/TVL</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Liquidity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrowedAssets.map(asset => (
              <AssetBorrowRow key={asset.underlyingToken} asset={asset} onClick={handleClick} />
            ))}

            {nonBorrowedAssets.map(asset =>
              asset.isPaused ? null : (
                <AssetBorrowRow key={asset.underlyingToken} asset={asset} onClick={handleClick} />
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function TotalCard({ title, value }: { title: string; value?: number | string | null }) {
  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h5">
        {value ? (
          typeof value === "string" ? (
            value
          ) : (
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
              notation: "compact",
            }).format(value)
          )
        ) : (
          <Skeleton width="150px" />
        )}
      </Typography>
    </>
  );
}

export function shortUsdFormatter(num: number) {
  return `$${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(num)}`;
}
