import { Trans } from "@lingui/macro";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

export const BondTable: React.FC<{ isInverseBond?: boolean }> = ({ children, isInverseBond = false }) => {
  return (
    <TableContainer>
      <Table aria-label="Available bonds" style={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: isInverseBond ? "180px" : "230px", padding: "8px 0" }}>
              <Trans>Token</Trans>
            </TableCell>

            {isInverseBond && (
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

            {!isInverseBond && (
              <TableCell style={{ padding: "8px 0" }}>
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
