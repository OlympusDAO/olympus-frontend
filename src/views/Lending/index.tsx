import { ArrowForward } from "@mui/icons-material";
import { Box, Link, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Chip, Metric, PrimaryButton, TokenStack } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { formatCurrency } from "src/helpers";
import { useGetLendAndBorrowStats } from "src/hooks/useGetLendBorrowStats";
import { useOhmPrice } from "src/hooks/usePrices";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";

export const Lending = () => {
  const theme = useTheme();
  const { data: ohmPrice } = useOhmPrice();
  const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const { data: clearingHouse } = useGetClearingHouse();
  const { data: defiLlamaPools } = useGetLendAndBorrowStats();

  const lowestBorrowRate = defiLlamaPools?.reduce((prev, current) => {
    const currentApy = current.lendAndBorrow
      ? current.lendAndBorrow.apyBaseBorrow - current.lendAndBorrow.apyRewardBorrow
      : 0;
    const prevApy = prev.lendAndBorrow ? prev.lendAndBorrow.apyBaseBorrow - prev.lendAndBorrow.apyRewardBorrow : 0;
    return prevApy < currentApy ? prev : current;
  });

  return (
    <div id="stake-view">
      <PageTitle name="Lend and Borrow" />
      <Box width="97%" maxWidth="974px">
        <Box>
          <Metric label="OHM Price" metric={ohmPrice ? formatCurrency(ohmPrice, 2) : <Skeleton />} />
        </Box>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" mt="50px" gap="20px">
          <Box position="relative" width={`${isMobileScreen ? "100%" : "48%"}`}>
            <Box position="absolute" display="flex" justifyContent="right" mt="-10px" right="33px">
              <Chip template="success" label={<Typography fontWeight="500">New</Typography>} />
            </Box>
            <Box
              borderRadius="12px"
              padding="32px"
              sx={{ backgroundColor: theme.colors.paper.card }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Typography fontSize="32px" fontWeight="500" lineHeight="36px" align="center">
                Cooler Loans
              </Typography>
              <Box my="16px">
                <Typography align="center" color={theme.colors.gray[40]} fontSize="12px">
                  Current Borrow APR
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography align="center" fontSize="27px" fontWeight="500">
                    {clearingHouse?.interestRate}%
                  </Typography>
                  <TokenStack tokens={["gOHM", "DAI"]} style={{ fontSize: "27px" }} />
                </Box>
              </Box>
              <Typography align="center" color={theme.colors.gray[40]}>
                Borrow DAI against your gOHM at a fixed rate
              </Typography>
              <Box mt="18px">
                <Link component={RouterLink} to="/lending/cooler">
                  <PrimaryButton sx={{ width: "100%" }}>
                    <Box display="flex" gap="6px">
                      <Typography fontWeight="500">Borrow against gOHM</Typography>
                      <ArrowForward sx={{ fontSize: "21px !important" }} />
                    </Box>
                  </PrimaryButton>
                </Link>
              </Box>
            </Box>
          </Box>
          <Box position="relative" width={`${isMobileScreen ? "100%" : "48%"}`}>
            <Box borderRadius="12px" padding="32px" sx={{ backgroundColor: theme.colors.paper.card }} flexWrap={"wrap"}>
              <Typography fontSize="32px" fontWeight="500" lineHeight="36px" align="center">
                Lending Markets
              </Typography>
              <Box my="16px">
                <Typography align="center" color={theme.colors.gray[40]} fontSize="12px">
                  Current Borrow APR
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography align="center" fontSize="27px" fontWeight="500">
                    {lowestBorrowRate?.lendAndBorrow?.apyBaseBorrow}%
                  </Typography>
                </Box>
              </Box>
              <Typography align="center" color={theme.colors.gray[40]}>
                Borrow OHM or leverage OHM holdings{" "}
              </Typography>
              <Box mt="18px">
                <Link component={RouterLink} to="/lending/markets">
                  <PrimaryButton sx={{ width: "100%" }}>
                    <Box display="flex" gap="6px">
                      <Typography fontWeight="500">View Lending Markets</Typography>
                      <ArrowForward sx={{ fontSize: "21px !important" }} />
                    </Box>
                  </PrimaryButton>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>

        <LiquidityCTA />
      </Box>
    </div>
  );
};
