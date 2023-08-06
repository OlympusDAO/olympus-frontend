import { Box, SvgIcon, Typography } from "@mui/material";
import { Icon, Metric, Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { ReactComponent as lendAndBorrowIcon } from "src/assets/icons/lendAndBorrow.svg";
import { Cooler } from "src/typechain";
import { useExtendLoan } from "src/views/Lending/Cooler/hooks/useExtendLoan";

export const ExtendLoan = ({
  loan,
  setLoan,
  interestRate,
  loanToCollateral,
  duration,
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
  interestRate?: string;
  loanToCollateral?: string;
  duration?: string;
  coolerAddress?: string;
}) => {
  const newMaturityDate = new Date();
  newMaturityDate.setDate(newMaturityDate.getDate() + Number(duration || 0));
  const extendLoan = useExtendLoan();
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
      {loan && coolerAddress ? (
        <>
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box display="flex" flexDirection="column">
              <Metric
                label="Current Term"
                metric={new Date(Number(loan.expiry.toString()) * 1000).toLocaleDateString() || ""}
              />
            </Box>
            <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
            <Box display="flex" flexDirection="column">
              <Metric label="New Term" metric={newMaturityDate.toLocaleDateString()} />
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

          <PrimaryButton
            fullWidth
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
          >
            Extend Loan
          </PrimaryButton>
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
};
