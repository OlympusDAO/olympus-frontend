import { LinearProgress, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import {
  OHMTokenProps,
  OHMTokenStackProps,
  PrimaryButton,
  Token,
  TokenStack,
  Tooltip,
} from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import { formatCurrency, formatNumber } from "src/helpers";
import { VaultInfo } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "6px",
}));

export const SingleSidedFarms = ({ vaults }: { vaults: VaultInfo[] }) => {
  return (
    <>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ height: "31px" }}>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Pool</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Vault Limit</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>TVL</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>APY</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vaults?.map(vault => (
            <TableRow key="temp2" sx={{ height: "71px" }}>
              <StyledTableCell component="th" scope="row">
                <Box display="flex" alignItems="center" gap="10px">
                  <TokenStack
                    tokens={[vault.pairTokenName as keyof OHMTokenStackProps["tokens"], "OHM"]}
                    sx={{ fontSize: "27px" }}
                  />{" "}
                  {vault.pairTokenName}
                  -OHM
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{formatNumber(Number(vault.limit))} OHM</Typography>
                <Box mt="3px" width="80%">
                  <LinearProgress variant="determinate" value={(Number(vault.ohmMinted) / Number(vault.limit)) * 100} />
                </Box>
              </StyledTableCell>
              <StyledTableCell>{formatCurrency(Number(vault.tvlUsd))}</StyledTableCell>
              <StyledTableCell>
                <Tooltip
                  message={
                    <>
                      {vault.rewards.map(reward => {
                        return (
                          <Box display="flex" alignItems="center" gap="4px" pt={"2px"}>
                            <Token name={reward.tokenName as OHMTokenProps["name"]} sx={{ fontSize: "21px" }} />
                            {formatNumber(Number(reward.apy), 2)}% {reward.tokenName}
                          </Box>
                        );
                      })}
                    </>
                  }
                >
                  {vault.totalApy}%
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell>
                <Link component={RouterLink} to={`/liquidity/vaults/${vault.vaultAddress}`}>
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
