import { Box, SvgIcon, Typography } from "@mui/material";
import { Icon, Input, Metric, Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { COOLER_CLEARING_HOUSE_ADDRESSES } from "src/constants/addresses";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { Cooler } from "src/typechain";
import { useExtendLoan } from "src/views/Lending/Cooler/hooks/useExtendLoan";

export const ExtendLoan = ({
  loan,
  setLoan,
  interestRate,
  loanToCollateral,
  duration,
  coolerAddress,
  debtAddress,
}: {
  loan: {
    request: Cooler.RequestStructOutput;
    principal: BigNumber;
    interestDue: BigNumber;
    collateral: BigNumber;
    expiry: BigNumber;
    lender: string;
    recipient: string;
    callback: boolean;
    loanId: number;
  };
  setLoan: React.Dispatch<any>;
  interestRate: string;
  loanToCollateral: string;
  duration?: string;
  coolerAddress?: string;
  debtAddress: string;
}) => {
  const extendLoan = useExtendLoan();
  const networks = useTestableNetworks();
  const { data: daiBalance } = useBalance({ [networks.MAINNET]: debtAddress || "" })[networks.MAINNET];
  const insufficientCollateral = false;
  const [extensionTerm, setExtensionTerm] = useState("1");
  const newMaturityDate = new Date(Number(loan?.expiry.toString()) * 1000);
  const paidInterest = Number(ethers.utils.formatUnits(loan.principal)) <= Number(loanToCollateral) ? 1 : 0;
  newMaturityDate.setDate(newMaturityDate.getDate() + Number(duration || 0) * Number(extensionTerm));
  const interestPercent =
    ((Number(extensionTerm) - paidInterest) * 121 * 86400 * Number(interestRate) * 0.01) / (365 * 86400);
  const interestDue = interestPercent * Number(ethers.utils.formatUnits(loan.principal));

  return (
    <Modal
      maxWidth="476px"
      minHeight="200px"
      open={Boolean(loan) && Boolean(coolerAddress)}
      headerContent={
        <Box display="flex" alignItems="center" gap="6px">
          <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">Extend Loan</Box>
        </Box>
      }
      onClose={() => setLoan(undefined)}
    >
      {coolerAddress ? (
        <>
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box display="flex" flexDirection="column">
              <Metric
                label="Current Term"
                metric={
                  new Date(Number(loan.expiry.toString()) * 1000).toLocaleDateString([], {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }) || ""
                }
              />
            </Box>
            <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
            <Box display="flex" flexDirection="column">
              <Metric
                label="New Term"
                metric={
                  newMaturityDate.toLocaleDateString([], {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }) || ""
                }
              />
            </Box>
          </Box>
          <Box mt={"16px"}>
            <Input
              id="duration"
              placeholder="1 Term = 121 days"
              endAdornment="Term"
              value={extensionTerm}
              onChange={e => {
                if (Number(e.target.value) > 0) {
                  console.log("e.target.value", e.target.value);
                  setExtensionTerm(e.target.value);
                } else {
                  console.log("e.target.value", e.target.value);
                  setExtensionTerm("");
                }
              }}
            />
          </Box>
          {interestRate && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb={"9px"}
              mt={"21px"}
            >
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Interest Rate</Typography>
              <Box display="flex" flexDirection="column" textAlign="right">
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}> {interestRate}%</Typography>
              </Box>
            </Box>
          )}
          {loanToCollateral && (
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Loan To Value per gOHM</Typography>
              <Box display="flex" flexDirection="column" textAlign="right">
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}> {loanToCollateral} DAI</Typography>
              </Box>
            </Box>
          )}
          {loanToCollateral && (
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Interest Due on Extension</Typography>
              <Box display="flex" flexDirection="column" textAlign="right">
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                  {formatNumber(interestDue > 0 ? interestDue : 0, 2)} DAI
                </Typography>
              </Box>
            </Box>
          )}

          <TokenAllowanceGuard
            tokenAddressMap={{ [networks.MAINNET]: debtAddress }}
            spenderAddressMap={COOLER_CLEARING_HOUSE_ADDRESSES}
            isVertical
            message={
              <>
                First time borrowing with <b>gOHM</b>? <br /> Please approve Olympus DAO to use your <b>gOHM</b> for
                borrowing.
              </>
            }
            spendAmount={new DecimalBigNumber(interestDue.toString())}
          >
            <PrimaryButton
              fullWidth
              disabled={extendLoan.isLoading || insufficientCollateral || Number(extensionTerm) < 1}
              onClick={() => {
                extendLoan.mutate(
                  { loanId: loan.loanId, coolerAddress, times: Number(extensionTerm) },
                  {
                    onSuccess: () => {
                      setLoan(undefined);
                    },
                  },
                );
              }}
              loading={extendLoan.isLoading}
            >
              {insufficientCollateral ? "Insufficient gOHM Balance" : "Extend Loan"}
            </PrimaryButton>
          </TokenAllowanceGuard>
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
};
