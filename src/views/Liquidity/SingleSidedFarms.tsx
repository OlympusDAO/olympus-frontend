import {
  LinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { PrimaryButton, TokenStack } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import { useGetSingleSidedLiquidityVaults } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "6px",
}));

export const SingleSidedFarms = () => {
  const theme = useTheme();
  const { data } = useGetSingleSidedLiquidityVaults();
  console.log(data, "data");

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
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>OHM Mint Limit</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Fees</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>TVL</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Total Rewards</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map(vault => (
            <TableRow key="temp2" sx={{ height: "71px" }}>
              <StyledTableCell component="th" scope="row">
                <Box display="flex" alignItems="center" gap="10px">
                  <TokenStack tokens={["ETH", "OHM"]} sx={{ fontSize: "27px" }} /> {vault.pairTokenName}-OHM
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{vault.limit} OHM</Typography>
                <Box mt="3px" width="80%">
                  <LinearProgress variant="determinate" value={(Number(vault.ohmMinted) / Number(vault.limit)) * 100} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>{vault.fee}</StyledTableCell>
              <StyledTableCell>{vault.totalLpBalance}</StyledTableCell>
              <StyledTableCell>Need Contract Work</StyledTableCell>
              <StyledTableCell>
                <Link component={RouterLink} to={`/liquidity/${vault.vaultAddress}`}>
                  <PrimaryButton fullWidth>Deposit Liquidity</PrimaryButton>
                </Link>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
