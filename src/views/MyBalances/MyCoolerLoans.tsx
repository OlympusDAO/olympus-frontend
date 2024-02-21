import { Box, Divider, LinearProgress, Link, SvgIcon, Typography, useTheme } from "@mui/material";
import { Token } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { Link as RouterLink } from "react-router-dom";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import { formatCurrency } from "src/helpers";
import { useGohmPriceDefiLlama } from "src/hooks/usePrices";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { useAccount } from "wagmi";

export const MyCoolerLoans = ({ balance, balanceUSD }: { balance: string; balanceUSD: string }) => {
  const theme = useTheme();
  const { address } = useAccount();
  const { data: gOhmPrice = 0 } = useGohmPriceDefiLlama();

  const { data: clearingHouseV1 } = useGetClearingHouse({ clearingHouse: "clearingHouseV1" });
  const { data: clearingHouseV2 } = useGetClearingHouse({ clearingHouse: "clearingHouseV2" });

  const { data: v1Loans, isFetched: isFetchedLoansV1 } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouseV1?.factory,
    collateralAddress: clearingHouseV1?.collateralAddress,
    debtAddress: clearingHouseV1?.debtAddress,
  });

  const { data: v2Loans, isFetched: isFetchedLoansV2 } = useGetCoolerLoans({
    walletAddress: address,
    factoryAddress: clearingHouseV2?.factory,
    collateralAddress: clearingHouseV2?.collateralAddress,
    debtAddress: clearingHouseV2?.debtAddress,
  });

  const loans = [...(v1Loans || []), ...(v2Loans || [])];

  const sortedLoans = loans
    .slice()
    .sort((a, b) => {
      const expiryDateA = new Date(Number(a.expiry.toString()) * 1000);
      const expiryDateB = new Date(Number(b.expiry.toString()) * 1000);
      const currentDate = new Date();
      const daysLeftA = Math.floor((expiryDateA.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      const daysLeftB = Math.floor((expiryDateB.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

      return daysLeftA - daysLeftB;
    })
    .slice(0, 3);

  if (sortedLoans.length === 0) {
    return <> </>;
  }

  return (
    <Box mt="18px">
      <Box display="flex" gap={"3px"} alignItems="center" justifyContent="space-between">
        <Box display="flex" gap="6px">
          <SvgIcon component={lendAndBorrowIcon} />
          <Typography fontWeight="500" fontSize="15px" lineHeight="24px">
            In Cooler Loans
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="end" gap="3px">
          <Typography fontSize="15px" fontWeight="500" lineHeight="24px">
            {balance} gOHM
          </Typography>
          <Typography fontSize="12px" fontWeight="450" lineHeight="12px" color={theme.colors.gray[40]}>
            {balanceUSD}
          </Typography>
        </Box>
      </Box>
      <Box mt="3px">
        <Divider />
      </Box>
      <Box>
        <Box display="flex" justifyContent="space-between" mt="12px">
          <Box width="50%" color={theme.colors.gray[90]} fontSize="12px">
            Collateral
          </Box>
          <Box width="50%" color={theme.colors.gray[90]} fontSize="12px">
            Term
          </Box>
        </Box>
        {sortedLoans.map(loan => {
          const requestDays = Number(ethers.utils.formatUnits(loan.request.duration.toString(), 0)) / 86400;
          const expiryDate = new Date(Number(loan.expiry.toString()) * 1000);
          const currentDate = new Date();
          const daysLeft = Math.floor((expiryDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
          const percentComplete = ((requestDays - daysLeft) / requestDays) * 100;
          return (
            <Box display="flex" justifyContent="space-between" mt="18px" key={loan.loanId}>
              <Box width="50%">
                <Box display="flex" gap="3px">
                  <Token name="gOHM" style={{ fontSize: "21px" }} />
                  <Typography fontSize="15px" fontWeight="500" lineHeight="24px">
                    {Number(ethers.utils.formatUnits(loan.collateral.toString())).toFixed(4)} gOHM
                  </Typography>
                </Box>
                <Typography fontSize="12px" fontWeight="450" lineHeight="12px" color={theme.colors.gray[40]} mt="3px">
                  {formatCurrency(gOhmPrice * Number(ethers.utils.formatUnits(loan.collateral.toString())), 2)}
                </Typography>
              </Box>
              <Box width="50%">
                <Box display="flex" gap="9px" alignItems="center">
                  <Box width="50%">
                    <LinearProgress variant="determinate" value={percentComplete} />
                  </Box>
                  <Box>
                    {expiryDate.toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) || ""}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
        <Box mt="18px" display="flex" justifyContent={"center"}>
          <Link component={RouterLink} to="/lending/cooler" fontWeight="500">
            Manage Cooler Loans
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
