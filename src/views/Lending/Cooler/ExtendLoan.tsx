import { Box, SvgIcon, Typography } from "@mui/material";
import { Icon, Metric, Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { COOLER_CLEARING_HOUSE_ADDRESSES } from "src/constants/addresses";
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
  collateralAddress,
}: {
  loan: {
    request: Cooler.RequestStructOutput;
    amount: BigNumber;
    repaid: BigNumber;
    collateral: BigNumber;
    expiry: BigNumber;
    lender: string;
    repayDirect: boolean;
    loanId: number;
    newCollateralAmount: BigNumber;
  };
  setLoan: React.Dispatch<any>;
  interestRate: string;
  loanToCollateral: string;
  duration?: string;
  coolerAddress?: string;
  collateralAddress: string;
}) => {
  const newMaturityDate = new Date(Number(loan?.expiry.toString()) * 1000);
  newMaturityDate.setDate(newMaturityDate.getDate() + Number(duration || 0));
  const extendLoan = useExtendLoan();
  const networks = useTestableNetworks();
  const { data: gohmBalance } = useBalance({ [networks.MAINNET]: collateralAddress || "" })[networks.MAINNET];
  const insufficientCollateral = gohmBalance?.lt(new DecimalBigNumber(loan.newCollateralAmount, 18 || "0"));
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
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Additional Collateral to Deposit</Typography>
              <Box display="flex" flexDirection="column" textAlign="right">
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                  {Number(ethers.utils.formatUnits(loan?.newCollateralAmount.toString() || "")).toFixed(4)} gOHM
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
            spendAmount={new DecimalBigNumber(loan.newCollateralAmount.toString(), 18)}
          >
            <PrimaryButton
              fullWidth
              disabled={extendLoan.isLoading || insufficientCollateral}
              onClick={() => {
                extendLoan.mutate(
                  { loanId: loan.loanId, coolerAddress },
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
