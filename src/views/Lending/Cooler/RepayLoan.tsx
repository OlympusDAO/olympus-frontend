import { Box, SvgIcon, Typography } from "@mui/material";
import { Icon, Metric, Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { Cooler } from "src/typechain";
import { useRepayLoan } from "src/views/Lending/Cooler/hooks/useRepayLoan";
// import { useRepayLoan } from "src/views/Lending/Cooler/hooks/useExtendLoan";

export const RepayLoan = ({
  loan,
  setLoan,
  loanToCollateral,
  debtAddress,
  coolerAddress,
}: {
  loan?: {
    request: Cooler.RequestStructOutput;
    amount: BigNumber;
    repaid: BigNumber;
    collateral: BigNumber;
    expiry: BigNumber;
    lender: string;
    repayDirect: boolean;
    loanId: number;
  };
  setLoan: React.Dispatch<any>;
  loanToCollateral: string;
  coolerAddress?: string;
  debtAddress: string;
}) => {
  //   const extendLoan = useRepayLoan();
  const networks = useTestableNetworks();
  const { data: daiBalance } = useBalance({ [networks.MAINNET]: debtAddress || "" })[networks.MAINNET];
  const repayLoan = useRepayLoan();

  const notEnoughDai = daiBalance?.toBigNumber().lt(loan?.amount || BigNumber.from("0"));

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
                metric={`${loan.amount && Number(ethers.utils.formatUnits(loan.amount.toString())).toFixed(4)} DAI`}
              />
            </Box>
            <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
            <Box display="flex" flexDirection="column">
              <Metric
                label="Get"
                metric={`${
                  loan.collateral && Number(ethers.utils.formatUnits(loan.collateral.toString())).toFixed(4)
                } gOHM`}
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
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Maturity Date</Typography>
            <Box display="flex" flexDirection="column" textAlign="right">
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                {new Date(Number(loan.expiry.toString()) * 1000).toLocaleDateString([], {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }) || ""}{" "}
                {new Date(Number(loan.expiry.toString()) * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) || ""}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Loan To Value per gOHM</Typography>
            <Box display="flex" flexDirection="column" textAlign="right">
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}> {loanToCollateral} DAI</Typography>
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
            spendAmount={new DecimalBigNumber(loan.amount, 18)}
          >
            <PrimaryButton
              onClick={() =>
                repayLoan.mutate(
                  {
                    coolerAddress: coolerAddress,
                    loanId: loan.loanId,
                    amount: loan.amount,
                  },
                  { onSuccess: () => setLoan(undefined) },
                )
              }
              fullWidth
              loading={repayLoan.isLoading}
              disabled={notEnoughDai || repayLoan.isLoading}
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
