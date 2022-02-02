import "./ChooseBond.scss";

import { Trans } from "@lingui/macro";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useState } from "react";
import { IUserBondDetails } from "src/slices/AccountSlice";

import { ClaimBondCardData, ClaimBondTableData } from "./ClaimRow";

export function ClaimBondsSubComponent({ activeBonds }: { activeBonds: IUserBondDetails[] }) {
  const [, setNumberOfBonds] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  useEffect(() => {
    const bondCount = activeBonds.length;
    setNumberOfBonds(bondCount);
  }, [activeBonds]);

  return (
    <Box style={{ width: "100%" }}>
      {!isSmallScreen && (
        <TableContainer>
          <Table aria-label="Claimable bonds">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Trans>Bond</Trans>
                </TableCell>
                <TableCell align="center">
                  <Trans>Claimable</Trans>
                </TableCell>
                <TableCell align="center">
                  <Trans>Pending</Trans>
                </TableCell>
                <TableCell align="right">
                  <Trans>Fully Vested</Trans>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(activeBonds).map((bond, i) => (
                <ClaimBondTableData key={i} userBond={bond} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isSmallScreen && Object.entries(activeBonds).map((bond, i) => <ClaimBondCardData key={i} userBond={bond} />)}
    </Box>
  );
}
