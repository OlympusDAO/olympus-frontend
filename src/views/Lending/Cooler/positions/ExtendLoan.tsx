import { Box, Skeleton, SvgIcon, Typography } from "@mui/material";
import { Icon, Input, Metric, Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { useMemo, useState } from "react";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
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
  clearingHouseAddress,
  debtAssetName,
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
  clearingHouseAddress: string;
  debtAssetName: string;
}) => {
  const extendLoan = useExtendLoan();
  const networks = useTestableNetworks();
  const { data: daiBalance } = useBalance({ [networks.MAINNET]: debtAddress || "" })[networks.MAINNET];

  const [extensionTerm, setExtensionTerm] = useState("1");

  // Loan expiry is extended from the original expiry date, not the current date
  const newMaturityDate = new Date(Number(loan?.expiry.toString()) * 1000);
  newMaturityDate.setDate(newMaturityDate.getDate() + Number(duration || 0) * Number(extensionTerm));

  // Interest is calculated based on the remaining principal amount * interest rate
  const interestPercent = (Number(extensionTerm) * 121 * 86400 * Number(interestRate) * 0.01) / (365 * 86400);
  const interestDue = interestPercent * Number(ethers.utils.formatUnits(loan.principal.add(loan.interestDue)));

  const [insufficientCollateral, setInsufficientCollateral] = useState<boolean | undefined>();
  useMemo(() => {
    if (!daiBalance) {
      setInsufficientCollateral(undefined);
      return;
    }

    if (Number(daiBalance) < interestDue) {
      setInsufficientCollateral(true);
    } else {
      setInsufficientCollateral(false);
    }
  }, [daiBalance, interestDue]);

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
                const value = e.target.value;
                // Only allow positive integers
                if (value === "" || (/^\d+$/.test(value) && Number(value) > 0)) {
                  setExtensionTerm(value);
                }
              }}
              type="text"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
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
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>{debtAssetName} Balance</Typography>
            <Box display="flex" flexDirection="column" textAlign="right">
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                {" "}
                {!daiBalance ? <Skeleton /> : daiBalance.toString({ decimals: 2 })} {debtAssetName}
              </Typography>
            </Box>
          </Box>
          {loanToCollateral && (
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
              <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Interest Due on Extension</Typography>
              <Box display="flex" flexDirection="column" textAlign="right">
                <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
                  {formatNumber(interestDue > 0 ? interestDue : 0, 2)} {debtAssetName}
                </Typography>
              </Box>
            </Box>
          )}

          <TokenAllowanceGuard
            tokenAddressMap={{ [networks.MAINNET]: debtAddress }}
            spenderAddressMap={{ [networks.MAINNET]: clearingHouseAddress }}
            isVertical
            message={
              <>
                First time repaying with <b>{debtAssetName}</b>? <br /> Please approve Olympus DAO to use your{" "}
                <b>{debtAssetName}</b> for payment.
              </>
            }
            spendAmount={new DecimalBigNumber(interestDue.toString(), 18)}
          >
            <PrimaryButton
              fullWidth
              disabled={extendLoan.isLoading || insufficientCollateral || Number(extensionTerm) < 1}
              onClick={() => {
                extendLoan.mutate(
                  { loanId: loan.loanId, coolerAddress, times: Number(extensionTerm), clearingHouseAddress },
                  {
                    onSuccess: () => {
                      setLoan(undefined);
                    },
                  },
                );
              }}
              loading={extendLoan.isLoading}
            >
              {insufficientCollateral ? `Insufficient ${debtAssetName} Balance` : "Extend Loan"}
            </PrimaryButton>
          </TokenAllowanceGuard>
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
};
