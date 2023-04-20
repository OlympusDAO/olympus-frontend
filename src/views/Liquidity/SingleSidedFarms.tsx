import {
  LinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { DataRow, OHMTokenStackProps, PrimaryButton, TokenStack, Tooltip } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import { formatCurrency, formatNumber } from "src/helpers";
import { VaultInfo } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "6px",
}));

export const SingleSidedFarms = ({ vaults }: { vaults: VaultInfo[] }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const MobileCard = ({ vault }: { vault: VaultInfo }) => {
    return (
      <Box mt="42px">
        <Box>
          <Box display="flex" alignItems="center" gap="10px">
            <TokenStack
              tokens={[vault.pairTokenName as keyof OHMTokenStackProps["tokens"], "OHM"]}
              sx={{ fontSize: "27px" }}
            />{" "}
            {vault.pairTokenName}
            -OHM
          </Box>
          <DataRow
            title={"OHM Minted"}
            balance={
              <Box>
                <Typography>{formatNumber(Number(vault.limit))} OHM</Typography>
                <Box mt="3px" width="100%">
                  <LinearProgress variant="determinate" value={(Number(vault.ohmMinted) / Number(vault.limit)) * 100} />
                </Box>
              </Box>
            }
          />
          <DataRow
            title={"APY"}
            balance={
              <Tooltip
                message={
                  <>
                    <Box display="flex" alignItems="center" gap="4px" pt={"2px"}>
                      Base APY: {formatNumber(Number(vault.apyBreakdown.baseApy), 2)}%
                    </Box>
                    <Box display="flex" alignItems="center" gap="4px" pt={"2px"}>
                      Rewards APY: {formatNumber(Number(vault.apyBreakdown.rewardApy), 2)}%
                    </Box>
                  </>
                }
              >
                {vault.totalApy}%
              </Tooltip>
            }
          />
          <div>
            <Link component={RouterLink} to={`/liquidity/vaults/${vault.vaultAddress}`}>
              <PrimaryButton fullWidth>Deposit Liquidity</PrimaryButton>
            </Link>
          </div>
        </Box>
      </Box>
    );
  };

  if (mobile) {
    return (
      <>
        {vaults.map((vault, index) => (
          <MobileCard key={index} vault={vault} />
        ))}
      </>
    );
  } else {
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
            {vaults?.map((vault, index) => (
              <TableRow key={index} sx={{ height: "71px" }}>
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
                  <Tooltip message={`${formatNumber(+vault.ohmMinted, 2)} OHM Minted`}>
                    <Box>
                      <Typography>{formatNumber(Number(vault.limit))} OHM</Typography>
                      <Box mt="3px" width="100%">
                        <LinearProgress
                          variant="determinate"
                          value={(Number(vault.ohmMinted) / Number(vault.limit)) * 100}
                        />
                      </Box>
                    </Box>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell>{formatCurrency(Number(vault.tvlUsd))}</StyledTableCell>
                <StyledTableCell>
                  <Tooltip
                    message={
                      <>
                        <Box display="flex" alignItems="center" gap="4px" pt={"2px"}>
                          Base APY: {formatNumber(Number(vault.apyBreakdown.baseApy), 2)}%
                        </Box>
                        <Box display="flex" alignItems="center" gap="4px" pt={"2px"}>
                          Rewards APY: {formatNumber(Number(vault.apyBreakdown.rewardApy), 2)}%
                        </Box>
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
  }
};
