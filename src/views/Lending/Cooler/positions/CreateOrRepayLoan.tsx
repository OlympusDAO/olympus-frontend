import { Box, Divider, SvgIcon } from "@mui/material";
import { Modal, OHMSwapCardProps, PrimaryButton, SwapCard, SwapCollection } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { ReactElement, useState } from "react";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import usdsIcon from "src/assets/tokens/usds.svg?react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { Cooler } from "src/typechain/Cooler";
import { useCreateCooler } from "src/views/Lending/Cooler/hooks/useCreateCooler";
import { useCreateLoan } from "src/views/Lending/Cooler/hooks/useCreateLoan";
import { useRepayLoan } from "src/views/Lending/Cooler/hooks/useRepayLoan";

export const CreateOrRepayLoan = ({
  collateralAddress,
  debtAddress,
  duration,
  interestRate,
  loanToCollateral,
  capacity,
  coolerAddress,
  factoryAddress,
  setModalOpen,
  modalOpen,
  loan,
  clearingHouseAddress,
  debtAssetName,
}: {
  collateralAddress: string;
  debtAddress: string;
  interestRate: string;
  duration: string;
  loanToCollateral: string;
  capacity: string;
  coolerAddress?: string;
  factoryAddress: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
  loan?: {
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
  clearingHouseAddress: string;
  debtAssetName: string;
}) => {
  const createCooler = useCreateCooler();
  const createLoan = useCreateLoan();
  const networks = useTestableNetworks();
  const repayLoan = useRepayLoan();

  const maturityDate = loan ? new Date(Number(loan.expiry.toString()) * 1000) : new Date();
  !loan && maturityDate.setDate(maturityDate.getDate() + Number(duration || 0));

  const [paymentAmount, setPaymentAmount] = useState(new DecimalBigNumber("0"));
  const [collateralAmount, setCollateralAmount] = useState(new DecimalBigNumber("0"));
  const { data: collateralBalance } = useBalance({ [networks.MAINNET]: collateralAddress || "" })[networks.MAINNET];
  const { data: debtBalance } = useBalance({ [networks.MAINNET]: debtAddress || "" })[networks.MAINNET];

  const collateralValue = Number(loanToCollateral) * Number(collateralBalance || 0);

  const loanPayable = new DecimalBigNumber(
    loan?.principal.add(loan?.interestDue || BigNumber.from("0")) || BigNumber.from("0"),
    18,
  );

  const maxYouCanBorrow = loan
    ? Math.min(Number(loanPayable), Number(debtBalance))
    : Math.min(Number(capacity), collateralValue);
  const interestRepaid = loan?.collateral.isZero() || false;
  //if collateral minus principal is greater than interest... then calculate on collateral amount.
  const debtCard = (
    <AssetSwapCard
      assetAddress={debtAddress}
      tokenName={debtAssetName as OHMSwapCardProps["token"]}
      tokenIcon={
        debtAssetName === "USDS" ? (
          <Box display="flex" gap="9px" alignItems="center">
            <SvgIcon color="primary" sx={{ width: "20px", height: "20px" }} viewBox="0 0 50 50" component={usdsIcon} />
            {debtAssetName}
          </Box>
        ) : undefined
      }
      value={paymentAmount.toString()}
      onChange={(e: { target: { value: DecimalBigNumber | string } }) => {
        const value = typeof e.target.value === "string" ? new DecimalBigNumber(e.target.value) : e.target.value;
        setPaymentAmount(value);
        const collateralToReceive = value
          .sub(loan && !interestRepaid ? new DecimalBigNumber(loan.interestDue, 18) : new DecimalBigNumber("0", 18))
          .div(new DecimalBigNumber(loanToCollateral));

        setCollateralAmount(collateralToReceive);
      }}
      loanBalance={loan?.principal.add(loan?.interestDue)}
    />
  );

  const gOHMCard = (
    <AssetSwapCard
      assetAddress={collateralAddress}
      tokenName="gOHM"
      value={collateralAmount.toString()}
      onChange={(e: { target: { value: DecimalBigNumber | string } }) => {
        const value = typeof e.target.value === "string" ? new DecimalBigNumber(e.target.value) : e.target.value;
        setCollateralAmount(value);
        setPaymentAmount(
          value.mul(
            loan && !interestRepaid
              ? new DecimalBigNumber(loanToCollateral).add(new DecimalBigNumber(loan.interestDue, 18))
              : new DecimalBigNumber(loanToCollateral),
          ),
        );
      }}
    />
  );
  return (
    <Modal
      maxWidth="542px"
      minHeight="200px"
      open={modalOpen}
      headerContent={
        <Box display="flex" alignItems="center" gap="6px">
          <SvgIcon component={lendAndBorrowIcon} />{" "}
          <Box fontWeight="500">
            {loan ? "Repay" : "Borrow"} {debtAssetName}
          </Box>
        </Box>
      }
      onClose={() => setModalOpen(false)}
    >
      <>
        <SwapCollection UpperSwapCard={loan ? debtCard : gOHMCard} LowerSwapCard={loan ? gOHMCard : debtCard} />
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Max you Can {loan ? "Repay" : "Borrow"}</Box>
          <Box fontWeight="500">
            {formatNumber(maxYouCanBorrow, 2)} {debtAssetName}
          </Box>
        </Box>
        <Box mt="18px" mb="21px">
          <Divider />
        </Box>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Interest rate</Box>
          <Box fontWeight="500">{interestRate}%</Box>
        </Box>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Maturity Date</Box>
          <Box fontWeight="500">
            {maturityDate.toLocaleDateString([], {
              month: "long",
              day: "numeric",
              year: "numeric",
            }) || ""}{" "}
            {maturityDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box>Loan To Value per gOHM</Box>
          <Box fontWeight="500">
            {formatNumber(Number(loanToCollateral), 2)} {debtAssetName}
          </Box>
        </Box>
        {loan && (
          <>
            <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
              <Box>Principal</Box>
              <Box fontWeight="500">
                {formatNumber(Number(ethers.utils.formatUnits(loan.principal)), 2)} {debtAssetName}
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
              <Box>Interest Due</Box>
              <Box fontWeight="500">
                {formatNumber(Number(ethers.utils.formatUnits(loan.interestDue)), 2)} {debtAssetName}
              </Box>
            </Box>
          </>
        )}
        <Box mt="18px" width="100%">
          <WalletConnectedGuard fullWidth>
            {!coolerAddress ? (
              <PrimaryButton
                fullWidth
                onClick={() =>
                  createCooler.mutate({
                    collateralAddress,
                    debtAddress,
                    factoryAddress,
                  })
                }
                loading={createCooler.isLoading}
                disabled={
                  createCooler.isLoading ||
                  Number(paymentAmount.toString()) > maxYouCanBorrow ||
                  Number(paymentAmount.toString()) === 0
                }
              >
                {Number(paymentAmount.toString()) > maxYouCanBorrow
                  ? `Amount requested exceeds capacity`
                  : `Create Cooler`}
              </PrimaryButton>
            ) : (
              <TokenAllowanceGuard
                tokenAddressMap={{ [networks.MAINNET]: loan ? debtAddress : collateralAddress }}
                spenderAddressMap={{ [networks.MAINNET]: loan ? coolerAddress : clearingHouseAddress }}
                isVertical
                message={
                  <>
                    First time {loan ? "repaying" : "borrowing"} with <b>{loan ? debtAssetName : "gOHM"}</b>? <br />{" "}
                    Please approve Olympus DAO to use your <b>{loan ? debtAssetName : "gOHM"}</b> for borrowing.
                  </>
                }
                spendAmount={
                  loan
                    ? new DecimalBigNumber(paymentAmount.toString(), 18)
                    : new DecimalBigNumber(collateralAmount.toString(), 18)
                }
              >
                <PrimaryButton
                  onClick={() => {
                    loan
                      ? repayLoan.mutate(
                          {
                            coolerAddress: coolerAddress,
                            loanId: loan.loanId,
                            amount: paymentAmount,
                          },
                          {
                            onSuccess: () => {
                              setCollateralAmount(new DecimalBigNumber("0"));
                              setPaymentAmount(new DecimalBigNumber("0"));
                              setModalOpen(false);
                            },
                          },
                        )
                      : coolerAddress &&
                        createLoan.mutate(
                          {
                            coolerAddress,
                            borrowAmount: paymentAmount,
                            clearingHouseAddress,
                          },
                          {
                            onSuccess: () => {
                              setCollateralAmount(new DecimalBigNumber("0"));
                              setPaymentAmount(new DecimalBigNumber("0"));
                              setModalOpen(false);
                            },
                          },
                        );
                  }}
                  disabled={
                    Number(paymentAmount.toString()) > maxYouCanBorrow ||
                    Number(paymentAmount.toString()) === 0 ||
                    createLoan.isLoading ||
                    repayLoan.isLoading
                  }
                  loading={createLoan.isLoading || repayLoan.isLoading}
                  fullWidth
                >
                  {loan
                    ? Number(paymentAmount) > Number(loanPayable)
                      ? `Payback Amount exceeds Loan`
                      : Number(paymentAmount.toString()) > Number(maxYouCanBorrow)
                        ? `Insufficient Funds for Repayment`
                        : `Repay Loan`
                    : Number(paymentAmount.toString()) > maxYouCanBorrow
                      ? `Amount requested exceeds capacity`
                      : `Borrow ${debtAssetName} & Open Position`}
                </PrimaryButton>
              </TokenAllowanceGuard>
            )}
          </WalletConnectedGuard>
        </Box>
      </>
    </Modal>
  );
};

const AssetSwapCard = ({
  assetAddress,
  tokenName,
  tokenIcon,
  value,
  onChange,
  loanBalance,
}: {
  assetAddress: string;
  tokenName: OHMSwapCardProps["token"];
  tokenIcon?: ReactElement;
  value: number | string;
  onChange: any;
  loanBalance?: BigNumber;
}) => {
  const networks = useTestableNetworks();
  const { data: balance } = useBalance({ [networks.MAINNET]: assetAddress || "" })[networks.MAINNET];

  const balanceToUse = loanBalance ? new DecimalBigNumber(loanBalance, 18) : balance || new DecimalBigNumber("0");
  return (
    <SwapCard
      id={tokenName as string}
      token={tokenIcon || tokenName}
      endString={`${loanBalance ? "Repayment" : "Balance"}: ${Number(balanceToUse?.toString() || "0").toFixed(
        4,
      )} ${tokenName}`}
      value={value}
      onChange={onChange}
      endStringOnClick={() => onChange({ target: { value: balanceToUse } })}
    />
  );
};
