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
  useMediaQuery,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";

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

  const isBondsLoading = useAppSelector(state => state.inverseBonds.loading ?? true);

  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  return (
    <>
      {inverseBonds.length === 0 && !isBondsLoading && (
        <Box display="flex" justifyContent="center" marginY="24px">
          <Typography variant="h4">
            <Trans>No active bonds</Trans>
          </Typography>
        </Box>
      )}
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
      <Box mt={2} mb={isSmallScreen && 1} className="help-text">
        <em>
          <Typography variant="body2">
            <Trans>
              Important: Inverse bonds allow you to bond your OHM for treasury assets. Vesting time is 0 and payouts are
              instant.
            </Trans>
          </Typography>
        </em>
      </Box>
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
