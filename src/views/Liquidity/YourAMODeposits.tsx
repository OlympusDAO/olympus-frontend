import { Box, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import {
  OHMTokenProps,
  OHMTokenStackProps,
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  Token,
  TokenStack,
} from "@olympusdao/component-library";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatNumber } from "src/helpers";
import { ClaimModal } from "src/views/Liquidity/ClaimModal";
import { useClaimRewards } from "src/views/Liquidity/hooks/useClaimRewards";
import { VaultInfo } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "6px",
}));

export const YourAmoDeposits = ({ vaults }: { vaults: VaultInfo[] }) => {
  const claim = useClaimRewards();
  const activeVaults = vaults.filter(vault => Number(vault.lpTokenBalance) > 0);
  const theme = useTheme();
  const [claimReward, setClaimReward] = useState({ open: false, vault: undefined as VaultInfo | undefined });
  return (
    <>
      <Box mb="21px" mt="9px">
        <Typography variant="h1">Your Positions</Typography>
        <p>Claim rewards or withdraw from your Single Sided Vault deposits.</p>
      </Box>
      {activeVaults.length === 0 ? (
        <>
          <Box mb="18px" pt="18px" display="flex" justifyContent="center" flexDirection="column" alignItems="center">
            <Typography fontSize="12px" fontWeight="500" lineHeight="15px">
              You don't have any Boosted LP deposits yet.
            </Typography>
            <Typography fontSize="12px" color={theme.colors.gray[40]} mb="16.5px">
              By doing so, you are strengthening the protocol and making your voice heard.
            </Typography>
            <TertiaryButton href="https://docs.olympusdao.finance">Learn about OHM Boosted Vaults</TertiaryButton>
          </Box>
        </>
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ height: "31px" }}>
              <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Pool</StyledTableCell>
              <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>LP Tokens</StyledTableCell>
              <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Accrued Rewards</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeVaults.map(vault => (
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
                  <Box display="flex" gap="9px">
                    <Link component={RouterLink} to={`/liquidity/vaults/${vault.vaultAddress}?withdraw=true`}>
                      <SecondaryButton fullWidth>Withdraw </SecondaryButton>
                    </Link>
                    <PrimaryButton
                      onClick={() => {
                        setClaimReward({ open: true, vault: vault });
                      }}
                      disabled={claim.isLoading}
                      loading={claim.isLoading}
                      fullWidth
                    >
                      Claim
                    </PrimaryButton>
                  </Box>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {claimReward.vault && (
        <ClaimModal
          depositToken={claimReward.vault.pairTokenName}
          rewards={claimReward.vault.rewards}
          isOpen={claimReward.open}
          setIsOpen={() => {
            setClaimReward({ open: false, vault: undefined });
          }}
          confirmButton={
            <PrimaryButton
              onClick={() => {
                claimReward.vault &&
                  claim.mutate(
                    { address: claimReward.vault.vaultAddress },
                    {
                      onSuccess: () => {
                        setClaimReward({ open: false, vault: undefined });
                      },
                    },
                  );
              }}
              disabled={claim.isLoading}
              loading={claim.isLoading}
              fullWidth
            >
              Claim
            </PrimaryButton>
          }
        />
      )}
    </>
  );
};
