import { Box, SvgIcon, Typography } from "@mui/material";
import { InfoNotification, Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { useState } from "react";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { COOLER_CONSOLIDATION_ADDRESSES, DAI_ADDRESSES, GOHM_ADDRESSES } from "src/constants/addresses";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useConsolidateCooler } from "src/views/Lending/Cooler/hooks/useConsolidateCooler";
import { useGetCoolerLoans } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";

export const ConsolidateLoans = ({
  coolerAddress,
  clearingHouseAddress,
  loans,
  duration,
}: {
  coolerAddress: string;
  clearingHouseAddress: string;
  loans: NonNullable<ReturnType<typeof useGetCoolerLoans>["data"]>;
  duration: string;
}) => {
  const coolerMutation = useConsolidateCooler();
  const [open, setOpen] = useState(false);
  const loanIds = loans.map(loan => loan.loanId);
  const totals = loans.reduce(
    (acc, loan) => {
      acc.principal = acc.principal.add(loan.principal);
      acc.interest = acc.interest.add(loan.interestDue);
      acc.collateral = acc.collateral.add(loan.collateral);
      return acc;
    },
    { principal: BigNumber.from(0), interest: BigNumber.from(0), collateral: BigNumber.from(0) },
  );
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + Number(duration || 0));

  return (
    <>
      <PrimaryButton onClick={() => setOpen(!open)}>Consolidate Loans</PrimaryButton>
      <Modal
        maxWidth="476px"
        minHeight="200px"
        open={open}
        headerContent={
          <Box display="flex" alignItems="center" gap="6px">
            <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">Consolidate Loans</Box>
          </Box>
        }
        onClose={() => setOpen(false)}
      >
        <>
          <InfoNotification>
            All existing open loans for this Cooler and Clearinghouse will be repaid and consolidated into a new loan
            with a {duration} day duration
          </InfoNotification>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mb={"9px"}
            mt={"21px"}
          >
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Loans to Consolidate</Typography>
            <Box display="flex" flexDirection="column" textAlign="right">
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>{loans.length}</Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mb={"9px"}
            mt={"21px"}
          >
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>New Principal Amount</Typography>
            <Box display="flex" flexDirection="column" textAlign="right">
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                {formatNumber(parseFloat(formatEther(totals.principal)), 4)} DAI
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mb={"9px"}
            mt={"21px"}
          >
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Interest Owed At Consolidation</Typography>
            <Box display="flex" flexDirection="column" textAlign="right">
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                {formatNumber(parseFloat(formatEther(totals.interest)), 4)} DAI
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mb={"9px"}
            mt={"21px"}
          >
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>New Maturity Date</Typography>
            <Box display="flex" flexDirection="column" textAlign="right">
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                {maturityDate.toLocaleDateString([], {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }) || ""}{" "}
                {maturityDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Box>
          <TokenAllowanceGuard
            tokenAddressMap={DAI_ADDRESSES}
            spenderAddressMap={COOLER_CONSOLIDATION_ADDRESSES}
            isVertical
            message={<>Approve DAI for Spending on the Consolidation Contract</>}
            spendAmount={new DecimalBigNumber(ethers.constants.MaxUint256, 18)}
            approvalText="Approve DAI for Spending"
          >
            <TokenAllowanceGuard
              tokenAddressMap={GOHM_ADDRESSES}
              spenderAddressMap={COOLER_CONSOLIDATION_ADDRESSES}
              isVertical
              message={<>Approve gOHM for Spending on the Consolidation Contract</>}
              spendAmount={new DecimalBigNumber(totals.collateral, 18)}
              approvalText="Approve gOHM for Spending"
            >
              <PrimaryButton
                onClick={() => {
                  coolerMutation.mutate(
                    {
                      coolerAddress,
                      clearingHouseAddress,
                      loanIds,
                    },
                    {
                      onSuccess: () => {
                        setOpen(false);
                      },
                    },
                  );
                }}
                loading={coolerMutation.isLoading}
                disabled={coolerMutation.isLoading}
                fullWidth
              >
                Consolidate Loans
              </PrimaryButton>
            </TokenAllowanceGuard>
          </TokenAllowanceGuard>
        </>
      </Modal>
    </>
  );
};
