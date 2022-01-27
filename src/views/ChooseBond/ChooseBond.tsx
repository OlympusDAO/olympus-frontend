import "./ChooseBond.scss";

import { t, Trans } from "@lingui/macro";
import {
  Box,
  ButtonBase,
  Grid,
  SvgIcon,
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
import { Metric, MetricCollection, Paper } from "@olympusdao/component-library";
import isEmpty from "lodash/isEmpty";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { allBondsMap } from "src/helpers/AllBonds";
import { useAppSelector } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useWeb3Context } from "src/hooks/web3Context";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { IUserNote } from "src/slices/BondSliceV2";

import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { formatCurrency } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import ClaimBonds from "../BondV2/ClaimBonds";
import { BondDataCard, BondTableData } from "./BondRow";

function ChooseBond() {
  const { networkId } = useWeb3Context();
  const history = useHistory();
  const { bonds } = useBonds(networkId);
  usePathForNetwork({ pathName: "bonds", networkID: networkId, history });
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading: boolean = useAppSelector(state => state.app.loading);
  const isAccountLoading: boolean = useAppSelector(state => state.account.loading);

  const accountNotes: IUserNote[] = useAppSelector(state => state.bondingV2.notes);

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

  const formattedTreasuryBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(treasuryBalance));

  const topRightCTA = (
    <ButtonBase>
      <Typography style={{ lineHeight: "33px" }}>
        <b>
          <Link to="/bonds" style={{ textDecoration: "none", color: "inherit" }}>
            <Trans>v2 bonds</Trans>
            <SvgIcon
              style={{ margin: "0 0 0 5px", verticalAlign: "text-bottom" }}
              component={ArrowUp}
              color="primary"
            />
          </Link>
        </b>
      </Typography>
    </ButtonBase>
  );
  return (
    <div id="choose-bond-view">
      {(!isEmpty(accountNotes) || !isEmpty(accountBonds)) && <ClaimBonds activeNotes={accountNotes} />}
      <Zoom in={true}>
        <Paper headerText={`${t`Bond`} (1,1)`} topRight={topRightCTA}>
          <MetricCollection>
            <Metric
              label={t`Treasury Balance`}
              metric={formattedTreasuryBalance}
              isLoading={!!treasuryBalance ? false : true}
            />
            <Metric
              label={t`OHM Price`}
              metric={formatCurrency(Number(marketPrice), 2)}
              isLoading={marketPrice ? false : true}
            />
          </MetricCollection>

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
                      // NOTE (appleseed): temporary for ONHOLD MIGRATION
                      // if (bond.getBondability(networkId)) {
                      if (bond.getBondability(networkId) || bond.getLOLability(networkId)) {
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
              // NOTE (appleseed): temporary for ONHOLD MIGRATION
              // if (bond.getBondability(networkId)) {
              if (bond.getBondability(networkId) || bond.getLOLability(networkId)) {
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
