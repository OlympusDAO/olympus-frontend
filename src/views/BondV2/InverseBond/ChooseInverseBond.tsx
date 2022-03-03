import { t, Trans } from "@lingui/macro";
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
  useMediaQuery,
  Zoom,
} from "@material-ui/core";
import { Metric, MetricCollection, Paper } from "@olympusdao/component-library";
import { useHistory } from "react-router-dom";
import { formatCurrency } from "src/helpers";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { IUserNote } from "src/slices/BondSliceV2";

import { BondDataCard, BondTableData } from "../BondRow";

function ChooseInverseBond() {
  const { networkId } = useWeb3Context();
  const history = useHistory();
  usePathForNetwork({ pathName: "bonds", networkID: networkId, history });

  const inverseBonds = useAppSelector(state => {
    return state.inverseBonds.indexes
      .map(index => state.inverseBonds.bonds[index])
      .sort((a, b) => b.discount - a.discount);
  });

  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const accountNotes: IUserNote[] = useAppSelector(state => state.bondingV2.notes);

  const marketPrice: number | undefined = useAppSelector(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useAppSelector(state => state.app.treasuryMarketValue);

  const isBondsLoading = useAppSelector(state => state.bondingV2.loading ?? true);

  const formattedTreasuryBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(treasuryBalance));

  return (
    <>
      <Zoom in={true}>
        <Paper headerText={`${t`Inverse Bond`} (3,1)`}>
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

          {!isSmallScreen && inverseBonds.length != 0 && (
            <Grid container item>
              <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Trans>Bond</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Payout Asset</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Price</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Discount</Trans>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inverseBonds.map(bond => {
                      if (bond.displayName !== "unknown")
                        return <BondTableData networkId={networkId} key={bond.index} bond={bond} inverseBond={true} />;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
          <Box mt={2} className="help-text">
            <em>
              <Typography variant="body2">
                Important: Inverse bonds allow you to bond your OHM for treasury assets.
              </Typography>
            </em>
          </Box>
        </Paper>
      </Zoom>
      {/* standard bonds for mobile, desktop is above */}
      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {inverseBonds.map(bond => {
              return (
                <Grid item xs={12} key={bond.index}>
                  <BondDataCard key={bond.index} bond={bond} networkId={networkId} inverseBond={true} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </>
  );
}
export default ChooseInverseBond;
