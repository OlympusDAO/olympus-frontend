import { Trans } from "@lingui/macro";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
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
      <>
        <Box my="24px" textAlign="center" id="test">
          <Typography variant="body2" color="textSecondary" style={{ fontSize: "1.075em" }}>
            <BondInfoText isInverseBond={props.isInverseBond} />
          </Typography>
        </Box>

        {sortByDiscount(bonds).map(bond => (
          <BondCard key={bond.id} bond={bond} />
        ))}
      </>
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

      <Box mt="24px" textAlign="center" width="70%" mx="auto">
        <Typography variant="body2" color="textSecondary" style={{ fontSize: "1.075em" }}>
          <BondInfoText isInverseBond={props.isInverseBond} />
        </Typography>
      </Box>
    </>
  );
};
