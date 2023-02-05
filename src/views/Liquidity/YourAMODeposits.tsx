import { Box, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/system";
import {
  OHMTokenProps,
  OHMTokenStackProps,
  PrimaryButton,
  SecondaryButton,
  Token,
  TokenStack,
} from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import { formatNumber } from "src/helpers";
import { useClaimRewards } from "src/views/Liquidity/hooks/useClaimRewards";
import { VaultInfo } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "6px",
}));

export const YourAmoDeposits = ({ vaults }: { vaults: VaultInfo[] }) => {
  const claim = useClaimRewards();
  return (
    <>
      <Box mb="18px" mt="9px">
        <Typography variant="h1">Your SSDV Deposits</Typography>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ height: "31px" }}>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Pool</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>LP Tokens</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Claim on Deposit</StyledTableCell>
            <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Rewards</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vaults.map(vault => (
            <TableRow key="temp" sx={{ height: "71px" }}>
              <StyledTableCell component="th" scope="row">
                <Box display="flex" alignItems="center" gap="10px">
                  <TokenStack
                    tokens={[vault.pairTokenName as keyof OHMTokenStackProps["tokens"], "OHM"]}
                    sx={{ fontSize: "27px" }}
                  />{" "}
                  {vault.pairTokenName}-OHM
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                {formatNumber(Number(vault.lpTokenBalance), 2)} {vault.pairTokenName}-OHM
              </StyledTableCell>
              <StyledTableCell>TBD</StyledTableCell>
              <StyledTableCell>
                {vault.rewards.map(reward => {
                  return (
                    <Box display="flex" alignItems="center" gap="4px" pt={"2px"}>
                      <Token name={reward.tokenName as OHMTokenProps["name"]} sx={{ fontSize: "21px" }} />
                      {formatNumber(Number(reward.userRewards), 2)} {reward.tokenName}
                    </Box>
                  );
                })}
              </StyledTableCell>
              <StyledTableCell>
                <Box display="flex">
                  <Link component={RouterLink} to={`/liquidity/${vault.vaultAddress}?withdraw=true`}>
                    <SecondaryButton>Withdraw </SecondaryButton>
                  </Link>

                  <PrimaryButton
                    onClick={() => {
                      claim.mutate({ address: vault.vaultAddress });
                    }}
                    disabled={claim.isLoading}
                    loading={claim.isLoading}
                  >
                    Claim
                  </PrimaryButton>
                </Box>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
