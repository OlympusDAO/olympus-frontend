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

import { BondDataCard, BondTableData } from "./BondRow";

function ChooseStraightBond() {
  const { networkId } = useWeb3Context();
  const history = useHistory();
  usePathForNetwork({ pathName: "bonds", networkID: networkId, history });

  const bondsV2 = useAppSelector(state => {
    return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]).sort((a, b) => b.discount - a.discount);
  });

  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const isBondsLoading = useAppSelector(state => state.bondingV2.loading ?? true);

  return (
    <>
      {bondsV2.length == 0 && !isBondsLoading && (
        <Box display="flex" justifyContent="center" marginY="24px">
          <Typography variant="h4">
            <Trans>No active bonds</Trans>
          </Typography>
        </Box>
      )}

      {!isSmallScreen && bondsV2.length != 0 && (
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
                  if (bond.displayName !== "unknown")
                    return <BondTableData networkId={networkId} key={bond.index} bond={bond} inverseBond={false} />;
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
              Important: New bonds are auto-staked (accrue rebase rewards) and no longer vest linearly. Simply claim as
              sOHM or gOHM at the end of the term.
            </Trans>
          </Typography>
        </em>
      </Box>

      {/* standard bonds for mobile, desktop is above */}
      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bondsV2.map(bond => {
              return (
                <Grid item xs={12} key={bond.index}>
                  <BondDataCard key={bond.index} bond={bond} networkId={networkId} inverseBond={false} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </>
  );
}
export default ChooseStraightBond;
