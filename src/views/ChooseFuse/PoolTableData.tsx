import "./ChooseFuse.scss";

import { t } from "@lingui/macro";
import { Avatar, Box, Link, Paper, TableCell, TableRow, Typography } from "@material-ui/core";
import { AvatarGroup, Skeleton } from "@material-ui/lab";
import { DataRow } from "@olympusdao/component-library";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

import { NetworkId } from "../../constants";
import { MergedPool } from "../../fuse-sdk/helpers/fetchFusePool";
import { useTokenData } from "../../fuse-sdk/hooks/useTokenData";
import { formatCurrency } from "../../helpers";
import { letterScore, usePoolRSS } from "../../hooks/useRss";

export function PoolDataCard({ pool, networkId }: { pool: MergedPool; networkId: NetworkId }) {
  const isPoolLoading = false;
  const rss = usePoolRSS(pool.id);
  const rssScore = rss ? letterScore(rss.totalScore) : "?";
  const tokens = pool.underlyingTokens.map((address, index) => ({
    symbol: pool.underlyingSymbols[index],
    address,
  }));

  return (
    <NavLink to={`/fuse/${pool.id}`}>
      <Paper className="fuse-data-card ohm-card">
        <div className="fuse-pair">
          <AvatarGroup spacing="small" max={10}>
            {tokens.map(({ address }) => (
              <TokenIcon address={address} key={address} />
            ))}
          </AvatarGroup>
          <div className="fuse-name">
            <Typography>{pool.name}</Typography>
          </div>
        </div>
        <DataRow title={t`Pool Assets`} balance={`${pool.id}`} isLoading={isPoolLoading} />
        <DataRow
          title={t`Total Supplied`}
          balance={formatCurrency(Number(pool.suppliedUSD), 2)}
          isLoading={isPoolLoading}
        />
        <DataRow
          title={t`Total Borrowed`}
          balance={formatCurrency(Number(pool.borrowedUSD), 2)}
          isLoading={isPoolLoading}
        />
        <DataRow title={t`Pool Risk Score`} balance={rssScore} isLoading={isPoolLoading} />
      </Paper>
    </NavLink>
  );
}

export function PoolTableData({ pool, networkId }: { pool: MergedPool; networkId: NetworkId }) {
  const isPoolLoading = !pool.totalBorrow ?? true;
  const rss = usePoolRSS(pool.id);
  const rssScore = rss ? letterScore(rss.totalScore) : "?";
  const tokens = pool.underlyingTokens.map((address, index) => ({
    symbol: pool.underlyingSymbols[index],
    address,
  }));
  return (
    <TableRow hover component={Link} href={`/fuse/${pool.id}/`}>
      <TableCell align="left" className="fuse-name-cell">
        <Box display="flex" flexDirection="column">
          <AvatarGroup spacing="small" max={10}>
            {tokens.map(({ address }) => (
              <TokenIcon address={address} key={address} />
            ))}
          </AvatarGroup>
          <div className="fuse-name">
            <Typography variant="body1">{pool.name}</Typography>
          </div>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography>{isPoolLoading ? <Skeleton width="50px" /> : pool.id}</Typography>
      </TableCell>
      <TableCell align="center">
        {isPoolLoading ? <Skeleton width="50px" /> : <DisplayFusePrice price={Number(pool.suppliedUSD)} />}
      </TableCell>
      <TableCell align="center">
        {isPoolLoading ? <Skeleton width="50px" /> : <DisplayFusePrice price={Number(pool.borrowedUSD)} />}
      </TableCell>
      <TableCell align="center">{rssScore}</TableCell>
    </TableRow>
  );
}

export const DisplayFusePrice = ({ price }: { price: number }) => {
  return <Fragment>{formatCurrency(price, 2)}</Fragment>;
};

function TokenIcon({ address }: { address: string }) {
  const tokenData = useTokenData(address);
  return (
    <Avatar
      src={tokenData?.logoURL ?? "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"}
    />
  );
}
