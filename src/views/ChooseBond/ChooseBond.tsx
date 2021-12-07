import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import { BondDataCard, BondTableData } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatCurrency } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import ClaimBonds from "./ClaimBonds";
import isEmpty from "lodash/isEmpty";
import { allBondsMap } from "src/helpers/AllBonds";
import { useAppSelector } from "src/hooks";
import { IUserBondDetails } from "src/slices/AccountSlice";

function ChooseBond() {
  const networkId = useAppSelector(state => state.network.networkId);
  const { bonds } = useBonds(networkId);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading: boolean = useAppSelector(state => state.app.loading);
  const isAccountLoading: boolean = useAppSelector(state => state.account.loading);

  const accountBonds: IUserBondDetails[] = useAppSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const marketPrice: number | undefined = useAppSelector(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance: number | undefined = useAppSelector(state => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances;
    }
  });

  return (
    <div id="choose-bond-view">
      {!isAccountLoading && !isEmpty(accountBonds) && <ClaimBonds activeBonds={accountBonds} />}

      <Zoom in={true}>
        <Paper className="ohm-card">
          <Box className="card-header">
            <Typography variant="h5" data-testid="t">
              <Trans>Bond</Trans> (1,1)
            </Typography>
          </Box>

          <Grid container item xs={12} style={{ margin: "10px 0px 20px" }} className="bond-hero">
            <Grid item xs={6}>
              <Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
                <Typography variant="h5" color="textSecondary">
                  <Trans>Treasury Balance</Trans>
                </Typography>
                <Box>
                  <Typography variant="h4" data-testid="treasury-balance">
                    {isAppLoading || isNaN(Number(treasuryBalance)) ? (
                      <Skeleton width="180px" data-testid="treasury-balance-loading" />
                    ) : (
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(Number(treasuryBalance))
                    )}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} className={`ohm-price`}>
              <Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
                <Typography variant="h5" color="textSecondary">
                  <Trans>OHM Price</Trans>
                </Typography>
                <Typography variant="h4">
                  {isAppLoading || isNaN(Number(marketPrice)) ? (
                    <Skeleton width="100px" />
                  ) : (
                    formatCurrency(Number(marketPrice), 2)
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {!isSmallScreen && (
            <Grid container item>
              <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Trans>Bond</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Price</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>ROI</Trans>
                      </TableCell>
                      <TableCell align="right">
                        <Trans>Purchased</Trans>
                      </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bonds.map(bond => {
                      if (bond.getBondability(networkId)) {
                        return <BondTableData key={bond.name} bond={bond} />;
                      }
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Paper>
      </Zoom>

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bonds.map(bond => {
              if (bond.getBondability(networkId)) {
                return (
                  <Grid item xs={12} key={bond.name}>
                    <BondDataCard key={bond.name} bond={bond} />
                  </Grid>
                );
              }
            })}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default ChooseBond;
