import "./ChooseFuse.scss";

import { t } from "@lingui/macro";
import { Box, Link, Paper, TableCell, TableRow, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { DataRow, TokenStack } from "@olympusdao/component-library";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

// import { getEtherscanUrl } from "src/helpers";
// import { useAppSelector } from "src/hooks";
import { NetworkId } from "../../constants";
import { MergedPool } from "../../fuse-sdk/helpers/fetchFusePool";
// import { DisplayBondDiscount, DisplayBondPrice } from "./BondV2";
// import { useTokensData } from "../../fuse-sdk/hooks/useTokenData";
import { formatCurrency } from "../../helpers";

export function PoolDataCard({ pool, networkId }: { pool: MergedPool; networkId: NetworkId }) {
  const isPoolLoading = false; //useAppSelector(state => state.bondingV2.loading);
  // const tokens = pool..map(a => a.underlyingSymbol).filter(Boolean);

  return (
    <NavLink to={`/fuse/${pool.id}`}>
      <Paper className="fuse-data-card ohm-card">
        <div className="fuse-pair">
          {/* @ts-ignore TODO */}
          <TokenStack tokens={pool.underlyingTokens} />
          <div className="fuse-name">
            <Typography>{pool.name}</Typography>
          </div>
        </div>
        <DataRow title={t`Pool Assets`} balance={`${pool.id}`} />
        <DataRow title={t`Total Supplied`} balance={formatCurrency(Number(pool.totalSupply), 2)} />
        <DataRow title={t`Total Borrowed`} balance={formatCurrency(Number(pool.totalBorrow), 2)} />
        {/* TODO risk score */}
        <DataRow title={t`Pool Risk Score`} balance="F" />
      </Paper>
    </NavLink>
  );
}

export function PoolTableData({ pool, networkId }: { pool: MergedPool; networkId: NetworkId }) {
  const isPoolLoading = !pool.totalBorrow ?? true;
  return (
    <TableRow hover component={Link} href={`/fuse/${pool.id}/`}>
      <TableCell align="left" className="fuse-name-cell">
        <Box display="flex" flexDirection="column">
          <TokenStack
            style={{ fontSize: 26, marginInlineEnd: "-0.5rem" }}
            // @ts-ignore
            tokens={pool.underlyingTokens}
          />
          <div className="fuse-name">
            <Typography variant="body1">{pool.name}</Typography>
          </div>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography>{isPoolLoading ? <Skeleton width="50px" /> : pool.id}</Typography>
      </TableCell>
      <TableCell align="center">
        {isPoolLoading ? <Skeleton width="50px" /> : <DisplayFusePrice price={Number(pool.totalSupply)} />}
      </TableCell>
      <TableCell align="center">
        {isPoolLoading ? <Skeleton width="50px" /> : <DisplayFusePrice price={Number(pool.totalBorrow)} />}
      </TableCell>
      <TableCell align="center">
        {/* TODO risk score */}
        {"F"}
      </TableCell>
    </TableRow>
  );
}

export const DisplayFusePrice = ({ price }: { price: number }) => {
  return <Fragment>{formatCurrency(price, 2)}</Fragment>;
};
