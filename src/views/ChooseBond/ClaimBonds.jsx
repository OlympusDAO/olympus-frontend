import React from "react";
import { trim, bondName, lpURL, isBondLP } from "../../helpers";
import { ClaimBondTableData, ClaimBondCardData } from "./BondRow";
import CardHeader from "../../components/CardHeader/CardHeader";

import {
  Button,
  Box,
  Link,
  Paper,
  Grid,
  Typography,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./choosebond.scss";

function ClaimBonds({ bonds }) {
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  return (
    <Zoom in={true}>
      <Paper className="ohm-card claim-bonds-card">
        <CardHeader title="Your Bonds (1,1)" />
        <Box>
          {!isSmallScreen && (
            <TableContainer>
              <Table aria-label="Claimable bonds">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Bond</TableCell>
                    <TableCell align="center">Claimable</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>Fully Vested</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bonds.map(bond => (
                    <ClaimBondTableData key={bond.value} bond={bond.value} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {isSmallScreen && bonds.map(bond => <ClaimBondCardData key={bond.value} bond={bond.value} />)}

          <Box
            display="flex"
            justifyContent="center"
            className={`global-claim-buttons ${isSmallScreen ? "small" : ""}`}
          >
            {bonds.length > 1 && (
              <Button variant="contained" color="primary" className="transaction-button" fullWidth>
                Claim all
              </Button>
            )}
            <Button variant="contained" color="primary" className="transaction-button" fullWidth>
              Claim and Stake
            </Button>
          </Box>
        </Box>
      </Paper>
    </Zoom>
  );
}

export default ClaimBonds;
