import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { PrimaryButton, SecondaryButton, TokenStack } from "@olympusdao/component-library";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "6px",
}));

export const YourAmoDeposits = () => (
  <>
    <Box mb="18px" mt="9px">
      <Typography variant="h1">Your AMO Deposits</Typography>
    </Box>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow sx={{ height: "31px" }}>
          <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Pool</StyledTableCell>
          <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>LP Tokens</StyledTableCell>
          <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Claim on Deposit</StyledTableCell>
          <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>OHM Minted</StyledTableCell>
          <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Rewards</StyledTableCell>
          <StyledTableCell></StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow key="temp" sx={{ height: "71px" }}>
          <StyledTableCell component="th" scope="row">
            <Box display="flex" alignItems="center" gap="10px">
              <TokenStack tokens={["ETH", "OHM"]} sx={{ fontSize: "27px" }} /> stETH-OHM
            </Box>
          </StyledTableCell>
          <StyledTableCell>Placeholder</StyledTableCell>
          <StyledTableCell>Placeholder</StyledTableCell>
          <StyledTableCell>Placeholder</StyledTableCell>
          <StyledTableCell>Placeholder</StyledTableCell>
          <StyledTableCell>
            <Box display="flex">
              <SecondaryButton>Withdraw</SecondaryButton>
              <PrimaryButton>Claim</PrimaryButton>
            </Box>
          </StyledTableCell>
        </TableRow>
        <TableRow key="temp2" sx={{ height: "71px" }}>
          <StyledTableCell component="th" scope="row">
            <Box display="flex" alignItems="center" gap="10px">
              <TokenStack tokens={["ETH", "OHM"]} sx={{ fontSize: "27px" }} /> stETH-OHM
            </Box>
          </StyledTableCell>
          <StyledTableCell>Placeholder</StyledTableCell>
          <StyledTableCell>Placeholder</StyledTableCell>
          <StyledTableCell>Placeholder</StyledTableCell>
          <StyledTableCell>Placeholder</StyledTableCell>
          <StyledTableCell>
            <Box display="flex">
              <SecondaryButton>Withdraw</SecondaryButton>
              <PrimaryButton>Claim</PrimaryButton>
            </Box>
          </StyledTableCell>
        </TableRow>
      </TableBody>
    </Table>
  </>
);
