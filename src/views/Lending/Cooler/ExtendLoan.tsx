import { Box, SvgIcon, Typography } from "@mui/material";
import { Icon, Metric, Modal, PrimaryButton } from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { COOLER_CLEARING_HOUSE_ADDRESSES } from "src/constants/addresses";
import { formatCurrency } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useExtendLoan } from "src/views/Lending/Cooler/hooks/useExtendLoan";
import { SnapshotLoan } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";

export const ExtendLoan = ({
  loan,
  setLoan,
  interestRate,
  loanToCollateral,
  duration,
  coolerAddress,
  collateralAddress,
}: {
  loan: SnapshotLoan;
  setLoan: React.Dispatch<any>;
  interestRate?: number;
  loanToCollateral?: number;
  duration?: number;
  coolerAddress?: string;
  collateralAddress?: string;
}) => {
  const extensionTimes = 1; // TODO migrate to input

  const [currentMaturityDate, setCurrentMaturityDate] = useState<Date | undefined>();
  useMemo(() => {
    if (!loan || !loan.expiryTimestamp || !duration) {
      setCurrentMaturityDate(undefined);
      return;
    }

    const _currentMaturityDate = new Date(loan.expiryTimestamp * 1000);
    setCurrentMaturityDate(_currentMaturityDate);
  }, [loan]);

  const [newMaturityDate, setNewMaturityDate] = useState<Date | undefined>();
  const [newCollateralAmount, setNewCollateralAmount] = useState<number | undefined>();
  useMemo(() => {
    if (!loan || !duration || !currentMaturityDate) {
      setNewMaturityDate(undefined);
      setNewCollateralAmount(undefined);
      return;
    }

    const _newMaturityDate = new Date(currentMaturityDate.getTime());
    _newMaturityDate.setDate(_newMaturityDate.getDate() + duration * extensionTimes);
    setNewMaturityDate(_newMaturityDate);

    const _newCollateralAmount = (loan.collateralPerPeriod || 0) * extensionTimes;
    setNewCollateralAmount(_newCollateralAmount);
  }, [loan, duration, currentMaturityDate]);

  const extendLoan = useExtendLoan();
  const networks = useTestableNetworks();
  const { data: gohmBalance } = useBalance({ [networks.MAINNET]: collateralAddress || "" })[networks.MAINNET];
  const insufficientCollateral = gohmBalance?.lt(new DecimalBigNumber(newCollateralAmount?.toString() || "0"));
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
                metric={currentMaturityDate ? currentMaturityDate.toLocaleDateString() : ""}
                isLoading={!currentMaturityDate}
              />
            </Box>
            <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
            <Box display="flex" flexDirection="column">
              <Metric
                label="New Term"
                metric={newMaturityDate ? newMaturityDate.toLocaleDateString() : ""}
                isLoading={!newMaturityDate}
              />
            </Box>
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
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}> {interestRate * 100}%</Typography>
              </Box>
            </Box>
          )}
          {loanToCollateral && (
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Loan To Value per gOHM</Typography>
              <Box display="flex" flexDirection="column" textAlign="right">
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                  {" "}
                  {formatCurrency(loanToCollateral, 0, "DAI")}
                </Typography>
              </Box>
            </Box>
          )}
          {loanToCollateral && (
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Additional Collateral to Deposit</Typography>
              <Box display="flex" flexDirection="column" textAlign="right">
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                  {formatCurrency(newCollateralAmount || 0, 4, "gOHM")}
                </Typography>
              </Box>
            </Box>
          )}

          <TokenAllowanceGuard
            tokenAddressMap={{ [networks.MAINNET]: collateralAddress }}
            spenderAddressMap={COOLER_CLEARING_HOUSE_ADDRESSES}
            isVertical
            message={
              <>
                First time borrowing with <b>gOHM</b>? <br /> Please approve Olympus DAO to use your <b>gOHM</b> for
                borrowing.
              </>
            }
            spendAmount={new DecimalBigNumber(newCollateralAmount?.toString() || "0")}
          >
            <PrimaryButton
              fullWidth
              disabled={extendLoan.isLoading || insufficientCollateral}
              onClick={() => {
                extendLoan.mutate(
                  {
                    loanId: loan.loanId || -1,
                    coolerAddress,
                  },
                  {
                    onSuccess: () => {
                      setLoan(undefined);
                    },
                  },
                );
              }}
              loading={extendLoan.isLoading || loan.loanId === undefined}
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
