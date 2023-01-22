import { LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { Box, styled } from "@mui/system";
import { PrimaryButton, TokenStack } from "@olympusdao/component-library";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "6px",
}));

export const SingleSidedFarms = () => {
  const theme = useTheme();

  return (
    <>
      <Box mb="18px" mt="9px">
        <Typography variant="h1">Single Sided Farms</Typography>
        <Typography>
          Increase OHM's use in DeFi by providing ERC-20 tokens in supported pools and Olympus will match your deposit
          with minted OHM.
        </Typography>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ height: "31px" }}>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Pool</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Exchange</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>OHM Mint Limit</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Fees</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>TVL</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Total Rewards</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key="temp1" sx={{ height: "71px" }}>
            <StyledTableCell component="th" scope="row">
              <Box display="flex" alignItems="center" gap="10px">
                <TokenStack tokens={["ETH", "OHM"]} sx={{ fontSize: "27px" }} /> stETH-OHM
              </Box>
            </StyledTableCell>
            <StyledTableCell>Placeholder</StyledTableCell>
            <StyledTableCell>Placeholder</StyledTableCell>
            <StyledTableCell>
              <Typography>Placeholder</Typography>
              <LinearProgress variant="determinate" value={50} />
            </StyledTableCell>
            <StyledTableCell>Placeholder</StyledTableCell>
            <StyledTableCell>Placeholder</StyledTableCell>
            <StyledTableCell>
              <PrimaryButton fullWidth>Deposit Liquidity</PrimaryButton>
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
            <StyledTableCell>
              <Typography>Placeholder</Typography>
              <LinearProgress variant="determinate" value={50} />
            </StyledTableCell>
            <StyledTableCell>Placeholder</StyledTableCell>
            <StyledTableCell>Placeholder</StyledTableCell>
            <StyledTableCell>
              <PrimaryButton fullWidth>Deposit Liquidity</PrimaryButton>
            </StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
