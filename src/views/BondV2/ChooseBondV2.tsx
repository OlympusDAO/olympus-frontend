import { useSelector } from "react-redux";
import {
  Box,
  ButtonBase,
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
  SvgIcon,
} from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import { BondDataCard, BondTableData } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatCurrency } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import ClaimBonds from "./ClaimBonds";
import isEmpty from "lodash/isEmpty";
import { allBondsMap } from "src/helpers/AllBonds";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { Metric, MetricCollection } from "src/components/Metric";
import { IBondV2, IUserNote } from "src/slices/BondSliceV2";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";

function ChooseBondV2() {
  const { networkId } = useWeb3Context();
  const history = useHistory();
  usePathForNetwork({ pathName: "bonds-v2", networkID: networkId, history });

  const bondsV2 = useAppSelector(state => {
    return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]);
  });

  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading: boolean = useAppSelector(state => state.app.loading);
  const isAccountLoading: boolean = useAppSelector(state => state.account.loading);

  const accountNotes: IUserNote[] = useAppSelector(state => state.bondingV2.notes);

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

  return (
    <div id="choose-bond-view">
      {!isAccountLoading && !isEmpty(accountNotes) && <ClaimBonds activeNotes={accountNotes} />}

      <Zoom in={true}>
        <Paper className="ohm-card">
          <Box className="card-header">
            <Typography variant="h5" data-testid="t">
              <Trans>Bond</Trans> (1,1)
            </Typography>

            <ButtonBase>
              <Typography>
                <b>
                  <Link to="/bonds" style={{ textDecoration: "none", color: "inherit" }}>
                    <Trans>V1 bonds available</Trans>
                    <SvgIcon style={{ margin: "0 0 -6px 5px", fontSize: "24px" }} component={ArrowUp} color="primary" />
                  </Link>
                </b>
              </Typography>
            </ButtonBase>
          </Box>

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
                        <Trans>Discount</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Duration</Trans>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bondsV2.map(bond => {
                      return <BondTableData key={bond.index} bond={bond} />;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
          <div className="help-text">
            <em>
              <Typography variant="body2">
                Important: Bonds no longer vest linearly. The bond can only be claimed at the end of the term. Bonds are
                auto-staking.
              </Typography>
            </em>
          </div>
        </Paper>
      </Zoom>

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bondsV2.map(bond => {
              return (
                <Grid item xs={12} key={bond.index}>
                  <BondDataCard key={bond.index} bond={bond} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default ChooseBondV2;
