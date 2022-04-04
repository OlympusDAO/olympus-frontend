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
} from "@material-ui/core";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
import { useScreenSize } from "src/hooks/useScreenSize";

import { useBonds } from "../../hooks/useBonds";
import { BondInfoText } from "../BondInfoText";
import { BondCard } from "./components/BondCard";
import { BondRow } from "./components/BondRow";

export const BondList: React.VFC<{ isInverseBond: boolean }> = props => {
  const bonds = useBonds().data;
  const isSmallScreen = useScreenSize("sm");

  if (!bonds) return null;

  if (isSmallScreen)
    return (
      <Grid container spacing={5}>
        <Box mt="24px" className="help-text">
          <Typography variant="body2">
            <BondInfoText isInverseBond={props.isInverseBond} />
          </Typography>
        </Box>

        {sortByDiscount(bonds).map(bond => (
          <Grid item xs={12}>
            <BondCard key={bond.id} bond={bond} />
          </Grid>
        ))}
      </Grid>
    );

  return (
    <>
      <TableContainer>
        <Table aria-label="Available bonds" style={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: props.isInverseBond ? "180px" : "230px", padding: "8px 0" }}>
                <Trans>Token</Trans>
              </TableCell>

              {props.isInverseBond && (
                <TableCell style={{ width: "180px", padding: "8px 0" }}>
                  <Trans>Payout Asset</Trans>
                </TableCell>
              )}

              <TableCell style={{ padding: "8px 0" }}>
                <Trans>Price</Trans>
              </TableCell>

              <TableCell style={{ padding: "8px 0" }}>
                <Trans>Discount</Trans>
              </TableCell>

              {!props.isInverseBond && (
                <TableCell style={{ padding: "8px 0" }}>
                  <Trans>Duration</Trans>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortByDiscount(bonds).map(bond => (
              <BondRow key={bond.id} bond={bond} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt="24px" className="help-text">
        <Typography variant="body2">
          <BondInfoText isInverseBond={props.isInverseBond} />
        </Typography>
      </Box>
    </>
  );
};
