import { Box, Skeleton, SvgIcon, Typography } from "@mui/material";
import { Icon, Metric, Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { formatCurrency } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { SnapshotLoan } from "src/views/Lending/Cooler/hooks/useGetCoolerLoans";
import { useRepayLoan } from "src/views/Lending/Cooler/hooks/useRepayLoan";

export const RepayLoan = ({
  loan,
  setLoan,
  loanToCollateral,
  debtAddress,
  coolerAddress,
}: {
  loan?: SnapshotLoan;
  setLoan: React.Dispatch<any>;
  loanToCollateral?: number;
  coolerAddress?: string;
  debtAddress?: string;
}) => {
  const networks = useTestableNetworks();
  const { data: daiBalance } = useBalance({ [networks.MAINNET]: debtAddress || "" })[networks.MAINNET];
  const repayLoan = useRepayLoan();

  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  useMemo(() => {
    if (!loan || !loan.expiryTimestamp) {
      setExpiryDate(undefined);
      return;
    }

    const _expiryDate = new Date(loan.expiryTimestamp * 1000);
    setExpiryDate(_expiryDate);
  }, [loan]);

  const [principalRemaining, setPrincipalRemaining] = useState<number | undefined>();
  useMemo(() => {
    if (!loan || loan.principal === undefined || loan.principalPaid === undefined) {
      setPrincipalRemaining(undefined);
      return;
    }

    const _principalRemaining = loan.principal - loan.principalPaid;
    setPrincipalRemaining(_principalRemaining);
  }, [loan]);

  const notEnoughDai = daiBalance?.toBigNumber().lt(loan?.principal || BigNumber.from("0"));

  return (
    <Modal
      maxWidth="476px"
      minHeight="200px"
      open={Boolean(loan) && Boolean(coolerAddress)}
      headerContent={
        <Box display="flex" alignItems="center" gap="6px">
          <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">Withdraw gOHM</Box>
        </Box>
      }
      onClose={() => setLoan(undefined)}
    >
      {loan && coolerAddress ? (
        <>
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box display="flex" flexDirection="column">
              <Metric
                label="Repay"
                metric={formatCurrency(principalRemaining || 0, 2, "DAI")}
                isLoading={!principalRemaining}
              />
            </Box>
            <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
            <Box display="flex" flexDirection="column">
              <Metric
                label="Get"
                metric={formatCurrency(loan.collateralDeposited || 0, 4, "gOHM")}
                isLoading={!loan.collateralDeposited}
              />
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
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Loan Term</Typography>
            <Box display="flex" flexDirection="column" textAlign="right">
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                {!expiryDate ? (
                  <Skeleton />
                ) : (
                  <>
                    {expiryDate.toLocaleDateString() || ""} {expiryDate.toLocaleTimeString() || ""}
                  </>
                )}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Loan To Value per gOHM</Typography>
            <Box display="flex" flexDirection="column" textAlign="right">
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                {" "}
                {formatCurrency(loanToCollateral || 0, 0, "DAI")}
              </Typography>
            </Box>
          </Box>

          <TokenAllowanceGuard
            tokenAddressMap={{ [networks.MAINNET]: debtAddress }}
            spenderAddressMap={{ [networks.MAINNET]: coolerAddress }}
            approvalText="Approve DAI"
            isVertical
            message={
              <>
                First time repaying with <b>DAI</b>? <br /> Please approve Olympus DAO to use your <b>DAI</b> for
                repaying.
              </>
            }
            spendAmount={new DecimalBigNumber(principalRemaining?.toString() || "0")}
          >
            <PrimaryButton
              onClick={() =>
                repayLoan.mutate(
                  {
                    coolerAddress: coolerAddress,
                    loanId: loan.loanId || -1,
                    amount: principalRemaining, // TODO Convert to correct number format
                  },
                  { onSuccess: () => setLoan(undefined) },
                )
              }
              loading={repayLoan.isLoading || loan.loanId === undefined}
              fullWidth
              disabled={notEnoughDai}
            >
              {notEnoughDai ? "Insufficient DAI for Repayment" : "Repay & Withdraw"}
            </PrimaryButton>
          </TokenAllowanceGuard>
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
};
