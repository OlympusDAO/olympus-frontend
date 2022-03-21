import { Trans } from "@lingui/macro";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

export const BondTableContainer: React.FC<{ isInverseBond?: boolean }> = ({ children, isInverseBond = false }) => {
  return (
    <TableContainer>
      <Table aria-label="Available bonds" style={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell />

            <TableCell>
              <Trans>Bond</Trans>
            </TableCell>

            {isInverseBond && (
              <TableCell>
                <Trans>Payout Asset</Trans>
              </TableCell>
            )}

            <TableCell>
              <Trans>Price</Trans>
            </TableCell>

            <TableCell>
              <Trans>Discount</Trans>
            </TableCell>

            {!isInverseBond && (
              <TableCell>
                <Trans>Duration</Trans>
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};
