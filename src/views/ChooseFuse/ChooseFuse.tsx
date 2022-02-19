import "./ChooseFuse.scss";

import { Trans } from "@lingui/macro";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Paper } from "@olympusdao/component-library";
// import isEmpty from "lodash/isEmpty";
// import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
// import { IUserBondDetails } from "src/slices/AccountSlice";
// import { getAllBonds, getUserNotes, IUserNote } from "src/slices/BondSliceV2";
import { AppDispatch } from "src/store";

import { useFusePools } from "../../fuse-sdk/hooks/useFusePool";
import { PoolDataCard, PoolTableData } from "./PoolTableData";

// import { formatCurrency } from "../../helpers";
// import { BondDataCard, BondTableData } from "./BondRow";
// import ClaimBonds from "./ClaimBonds";

function FusePools() {
  const { networkId, address, provider } = useWeb3Context();
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  usePathForNetwork({ pathName: "fuse", networkID: networkId, history });

  const { pools = [] } = useFusePools();
  //    useAppSelector(state => {
  //     return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]).sort((a, b) => b.discount - a.discount);
  //   });

  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  //   const accountNotes: IUserNote[] = useAppSelector(state => state.bondingV2.notes);

  //   const marketPrice: number | undefined = useAppSelector(state => {
  //     return state.app.marketPrice;
  //   });

  const treasuryBalance = useAppSelector(state => state.app.treasuryMarketValue);

  const isFuseLoading = false; // useAppSelector(state => state.bondingV2.loading ?? true);

  //   const formattedTreasuryBalance = new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     maximumFractionDigits: 0,
  //     minimumFractionDigits: 0,
  //   }).format(Number(treasuryBalance));

  //   useEffect(() => {
  //     const interval = setTimeout(() => {
  //       dispatch(getAllBonds({ address, networkID: networkId, provider }));
  //       dispatch(getUserNotes({ address, networkID: networkId, provider }));
  //     }, 60000);
  //     return () => clearTimeout(interval);
  //   });

  //   const v1AccountBonds: IUserBondDetails[] = useAppSelector(state => {
  //     const withInterestDue = [];
  //     for (const bond in state.account.bonds) {
  //       if (state.account.bonds[bond].interestDue > 0) {
  //         withInterestDue.push(state.account.bonds[bond]);
  //       }
  //     }
  //     return withInterestDue;
  //   });

  return (
    <div id="choose-fuse-view">
      {/* {(!isEmpty(accountNotes) || !isEmpty(v1AccountBonds)) && <ClaimBonds activeNotes={accountNotes} />} */}

      <Zoom in={true}>
        <Paper>
          {pools.length == 0 && !isFuseLoading && (
            <Box display="flex" justifyContent="center" marginY="24px">
              <Typography variant="h4">No active fuses</Typography>
            </Box>
          )}
          {!isSmallScreen && pools.length > 0 && (
            <Grid container item>
              <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" width={"40%"}>
                        <Trans>Pool Assets</Trans>
                      </TableCell>
                      <TableCell align="center">
                        <Trans>Pool Number</Trans>
                      </TableCell>
                      <TableCell align="center">
                        <Trans>Total Supplied</Trans>
                      </TableCell>
                      <TableCell align="center">
                        <Trans>Total Borrowed</Trans>
                      </TableCell>
                      <TableCell align="center">Pool Risk Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pools.map(f => (
                      <PoolTableData networkId={networkId} key={f.name} pool={f} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Paper>
      </Zoom>

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container spacing={2}>
            {pools.map(f => (
              <Grid item xs={12} key={f.id}>
                <PoolDataCard key={f.id} pool={f} networkId={networkId} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default FusePools;
