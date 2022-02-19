import "./ChooseFuse.scss";

import { Trans } from "@lingui/macro";
import { Box, Link, Paper, TableCell, TableRow, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { TokenStack } from "@olympusdao/component-library";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

// import { getEtherscanUrl } from "src/helpers";
// import { useAppSelector } from "src/hooks";
import { NetworkId } from "../../constants";
// import { DisplayBondDiscount, DisplayBondPrice } from "./BondV2";
import { FusePoolData } from "../../fuse-sdk/helpers/fetchFusePoolData";
// import { useTokensData } from "../../fuse-sdk/hooks/useTokenData";
import { formatCurrency } from "../../helpers";

export function FuseDataCard({ fuse, networkId }: { fuse: FusePoolData; networkId: NetworkId }) {
  const isFuseLoading = false; //useAppSelector(state => state.bondingV2.loading);
  const tokens = fuse.assets.map(a => a.underlyingSymbol).filter(Boolean);

  return (
    <NavLink to={`/fuse/${fuse.id}`}>
      <Paper className="fuse-data-card ohm-card">
        <div className="fuse-pair">
          {/* @ts-ignore TODO */}
          <TokenStack tokens={tokens} />
          <div className="fuse-name">
            <Typography>{fuse.name}</Typography>
          </div>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Pool Assets</Trans>
          </Typography>
          <Typography>{isFuseLoading ? <Skeleton width="50px" /> : fuse.id}</Typography>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Total Supplied</Trans>
          </Typography>
          <Typography>
            {isFuseLoading ? <Skeleton width="50px" /> : <DisplayFusePrice price={fuse.totalSuppliedUSD} />}
          </Typography>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Total Borrowed</Trans>
          </Typography>
          <Typography>
            {isFuseLoading ? <Skeleton width="50px" /> : <DisplayFusePrice price={fuse.totalBorrowedUSD} />}
          </Typography>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Pool Risk Score</Trans>
          </Typography>
          {/* /TODO risk score */}
          <Typography>{isFuseLoading ? <Skeleton width="50px" /> : "F"}</Typography>
        </div>
      </Paper>
    </NavLink>
  );
}

export function FuseTableData({ fuse, networkId }: { fuse: FusePoolData; networkId: NetworkId }) {
  const isFuseLoading = !fuse.totalBorrowedUSD ?? true;
  const tokens = fuse.assets.map(a => a.underlyingSymbol).filter(Boolean);
  //   const tokens = useTokensData(fuse.assets.map(a => a.underlyingToken))
  //     .map(t => (t ? t.symbol : undefined))
  //     .filter(Boolean);
  console.log(fuse);
  return (
    <TableRow hover component={Link} href={`/fuse/${fuse.id}/`}>
      <TableCell align="left" className="fuse-name-cell">
        <Box display="flex" flexDirection="column">
          <TokenStack
            style={{ fontSize: 26, marginInlineEnd: "-0.5rem" }}
            //  @ts-ignore
            tokens={[...tokens]}
          />
          <div className="fuse-name">
            <Typography variant="body1">{fuse.name}</Typography>
          </div>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography>{isFuseLoading ? <Skeleton width="50px" /> : fuse.id}</Typography>
      </TableCell>
      <TableCell align="center">
        {isFuseLoading ? <Skeleton width="50px" /> : <DisplayFusePrice price={fuse.totalSuppliedUSD} />}
      </TableCell>
      <TableCell align="center">
        {isFuseLoading ? <Skeleton width="50px" /> : <DisplayFusePrice price={fuse.totalBorrowedUSD} />}
      </TableCell>
      <TableCell align="center">
        {/* TODO risk score */}
        {"F"}
      </TableCell>
    </TableRow>
  );
}

export const DisplayFusePrice = ({ price }: { price: number }) => {
  return <Fragment>{formatCurrency(price)}</Fragment>;
};
