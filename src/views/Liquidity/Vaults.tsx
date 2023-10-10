import { ArrowBack } from "@mui/icons-material";
import { Box, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Metric } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { formatCurrency } from "src/helpers";
import { useGetSingleSidedLiquidityVaults } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";
import { VaultFAQ } from "src/views/Liquidity/VaultFAQ";
import { YourAmoDeposits } from "src/views/Liquidity/YourAMODeposits";

export const Vaults = () => {
  const { data: vaults, isLoading } = useGetSingleSidedLiquidityVaults();
  const vaultsWithDeposits = vaults && vaults.filter(vault => vault.lpTokenBalance !== "0");
  console.log(vaultsWithDeposits);
  const totalTVL = vaults?.reduce((acc, vault) => acc + Number(vault.tvlUsd), 0);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div id="stake-view">
      <PageTitle
        name={
          <Box display="flex" flexDirection="row" alignItems="center" mt={mobile ? "50px" : "0px"}>
            <Link component={RouterLink} to="/liquidity">
              <Box display="flex" flexDirection="row">
                <ArrowBack />
                <Typography fontWeight="500" marginLeft="9.5px" marginRight="18px">
                  Back
                </Typography>
              </Box>
            </Link>
            <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
              <Typography fontSize="32px" fontWeight={500}>
                Boosted Liquidity
              </Typography>
            </Box>
          </Box>
        }
      />

      <Box width="97%" maxWidth="974px">
        <Box mb="66px" display="flex" justifyContent="center">
          <Box maxWidth="200px">
            <Metric label="TVL in Vaults" metric={totalTVL ? formatCurrency(totalTVL) : "$0"} isLoading={isLoading} />
          </Box>
        </Box>
        {vaultsWithDeposits && vaultsWithDeposits.length > 0 && (
          <>
            <YourAmoDeposits vaults={vaultsWithDeposits} />
            <Box mb="33px" />
          </>
        )}
        <Box mt="100px">
          <VaultFAQ />
        </Box>
      </Box>
    </div>
  );
};
