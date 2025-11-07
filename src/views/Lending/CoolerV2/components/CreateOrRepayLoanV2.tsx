import { Box, SvgIcon } from "@mui/material";
import { Modal, PrimaryButton, SwapCollection } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { COOLER_V2_COMPOSITES_ADDRESSES, COOLER_V2_MONOCOOLER_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CollateralInputCard } from "src/views/Lending/CoolerV2/components/CollateralInputCard";
import { DebtInputCard } from "src/views/Lending/CoolerV2/components/DebtInputCard";
import { LoanInformation } from "src/views/Lending/CoolerV2/components/LoanInformation";
import { LoanToValueSlider } from "src/views/Lending/CoolerV2/components/LoanToValueSlider";
import { useIsSmartContractWallet } from "src/views/Lending/CoolerV2/hooks/useIsSmartContractWallet";
import { useMonoCoolerAuthorization } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerAuthorization";
import { useMonoCoolerCalculations } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerCalculations";
import { calculateRepayAmount, useMonoCoolerDebt } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerDebt";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";
import { useAccount } from "wagmi";

interface CreateOrRepayLoanV2Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
  loan?: {
    debt: BigNumber;
    collateral: BigNumber;
  };
  isRepayMode: boolean;
}

export const CreateOrRepayLoanV2 = ({ setModalOpen, modalOpen, loan, isRepayMode }: CreateOrRepayLoanV2Props) => {
  const networks = useTestableNetworks();
  const { data: position } = useMonoCoolerPosition();
  const { data: collateralBalance } = useBalance({ [networks.MAINNET_HOLESKY]: position?.collateralAddress || "" })[
    networks.MAINNET_HOLESKY
  ];
  const { data: debtBalance } = useBalance({ [networks.MAINNET_HOLESKY]: position?.debtAddress || "" })[
    networks.MAINNET_HOLESKY
  ];
  const { borrow, repay, withdrawCollateral, repayAndRemoveCollateral, addCollateralAndBorrow, addCollateral } =
    useMonoCoolerDebt();
  const { address } = useAccount();

  // Multisig support
  const { isSmartContractWallet } = useIsSmartContractWallet();
  const { isAuthorized, setAuthorization } = useMonoCoolerAuthorization();

  const {
    // State
    collateralAmount,
    borrowAmount,
    ltvPercentage,
    // Calculations
    currentDebt,
    maxPotentialBorrowAmount,
    liquidationThreshold,
    collateralToBeReleased,
    oneHourInterest,
    projectedDebt,
    projectedCollateral,
    additionalBorrowingAvailable,
    // State handlers
    handleLtvChange,
    handleCollateralChange,
    handleDebtChange,
    resetState,
  } = useMonoCoolerCalculations({ loan, isRepayMode });

  const withdrawOnly = isRepayMode && borrowAmount.eq(new DecimalBigNumber("0", 18));

  if (!position) return null;

  const wouldUseComposites =
    // Case 1: Borrowing with collateral
    (!isRepayMode &&
      collateralAmount.gt(new DecimalBigNumber("0", 18)) &&
      borrowAmount.gt(new DecimalBigNumber("0", 18))) ||
    // Case 2: Repaying and withdrawing
    (isRepayMode &&
      borrowAmount.gt(new DecimalBigNumber("0", 18)) &&
      collateralToBeReleased.gt(new DecimalBigNumber("0", 18)));

  // For composites, always use the composite contract (for token approvals)
  const interactWithComposites = wouldUseComposites;

  // Check if repay amount exceeds wallet balance
  const exceedsDebtBalance = isRepayMode && borrowAmount.gt(debtBalance || new DecimalBigNumber("0", 18));

  // Check if multisig needs authorization
  const multisigNeedsAuth = isSmartContractWallet && wouldUseComposites && !isAuthorized;

  return (
    <Modal
      maxWidth="542px"
      minHeight="200px"
      open={modalOpen}
      headerContent={
        <Box display="flex" alignItems="center" gap="6px">
          <SvgIcon component={lendAndBorrowIcon} /> <Box fontWeight="500">{isRepayMode ? "Repay" : "Borrow"} USDS</Box>
        </Box>
      }
      onClose={() => setModalOpen(false)}
    >
      <>
        <SwapCollection
          UpperSwapCard={
            isRepayMode ? (
              <DebtInputCard
                borrowAmount={borrowAmount}
                onBorrowAmountChange={handleDebtChange}
                loan={loan}
                isRepayMode={isRepayMode}
                disabled={borrow.isLoading || repay.isLoading}
                walletBalance={debtBalance}
              />
            ) : (
              <CollateralInputCard
                isRepayMode={isRepayMode}
                collateralAmount={collateralAmount}
                collateralToBeReleased={collateralToBeReleased}
                onCollateralChange={handleCollateralChange}
                disabled={borrow.isLoading || repay.isLoading}
                currentDebt={currentDebt}
              />
            )
          }
          LowerSwapCard={
            isRepayMode ? (
              <CollateralInputCard
                isRepayMode={isRepayMode}
                collateralAmount={collateralAmount}
                collateralToBeReleased={collateralToBeReleased}
                onCollateralChange={handleCollateralChange}
                disabled={borrow.isLoading || repay.isLoading}
                currentDebt={currentDebt}
              />
            ) : (
              <DebtInputCard
                borrowAmount={borrowAmount}
                onBorrowAmountChange={handleDebtChange}
                loan={loan}
                isRepayMode={isRepayMode}
                disabled={borrow.isLoading || repay.isLoading}
              />
            )
          }
        />

        {!isRepayMode && additionalBorrowingAvailable.gt(new DecimalBigNumber("0", 18)) && <Box mt="12px"></Box>}

        <LoanToValueSlider ltvPercentage={ltvPercentage} onLtvChange={handleLtvChange} isRepayMode={isRepayMode} />

        <LoanInformation
          isRepayMode={isRepayMode}
          liquidationThreshold={liquidationThreshold}
          projectedDebt={projectedDebt}
          projectedCollateral={projectedCollateral}
          maxPotentialBorrowAmount={maxPotentialBorrowAmount}
          additionalBorrowingAvailable={additionalBorrowingAvailable}
          oneHourInterest={oneHourInterest}
        />

        <Box mt="18px" width="100%">
          <WalletConnectedGuard fullWidth>
            {(() => {
              // Common loading states
              const isLoading =
                borrow.isLoading ||
                repay.isLoading ||
                withdrawCollateral.isLoading ||
                repayAndRemoveCollateral.isLoading ||
                addCollateralAndBorrow.isLoading ||
                addCollateral.isLoading ||
                setAuthorization.isLoading;

              // Check if collateral exceeds balance
              const exceedsCollateralBalance =
                !isRepayMode && collateralAmount.gt(collateralBalance || new DecimalBigNumber("0", 18));

              // Check for zero amounts
              const isZeroCollateralAndDebt =
                collateralAmount.eq(new DecimalBigNumber("0", 18)) && borrowAmount.eq(new DecimalBigNumber("0", 18));

              // Check for minimum debt requirement
              const isDebtBelowMinimum =
                projectedDebt.gt(new DecimalBigNumber("0", 18)) && projectedDebt.lt(new DecimalBigNumber("1000", 18));

              // Check if trying to repay more than current debt
              const exceedsCurrentDebt = isRepayMode && borrowAmount.gt(currentDebt);

              // Get appropriate button text
              const buttonText = multisigNeedsAuth
                ? "Authorize Composites Contract"
                : isRepayMode
                  ? withdrawOnly
                    ? "Withdraw Collateral"
                    : "Repay Loan"
                  : loan
                    ? borrowAmount.gt(new DecimalBigNumber("0", 18))
                      ? "Borrow More"
                      : collateralAmount.gt(new DecimalBigNumber("0", 18))
                        ? "Supply Collateral"
                        : "Enter Amount"
                    : borrowAmount.gt(new DecimalBigNumber("0", 18))
                      ? "Create Loan"
                      : collateralAmount.gt(new DecimalBigNumber("0", 18))
                        ? "Supply Collateral"
                        : "Enter Amount";

              // Check all disable conditions
              if (isLoading) {
                return (
                  <PrimaryButton fullWidth disabled loading>
                    Transaction in progress...
                  </PrimaryButton>
                );
              }

              if (exceedsCollateralBalance) {
                return (
                  <PrimaryButton fullWidth disabled>
                    Insufficient collateral balance
                  </PrimaryButton>
                );
              }

              if (exceedsDebtBalance) {
                return (
                  <PrimaryButton fullWidth disabled>
                    Insufficient USDS balance
                  </PrimaryButton>
                );
              }

              if (isZeroCollateralAndDebt) {
                return (
                  <PrimaryButton fullWidth disabled>
                    Enter an amount
                  </PrimaryButton>
                );
              }

              if (isDebtBelowMinimum) {
                return (
                  <PrimaryButton fullWidth disabled>
                    Minimum debt is 1000 USDS
                  </PrimaryButton>
                );
              }

              if (exceedsCurrentDebt) {
                return (
                  <PrimaryButton fullWidth disabled>
                    Amount exceeds current debt
                  </PrimaryButton>
                );
              }

              if (isRepayMode) {
                if (withdrawOnly && withdrawCollateral.isLoading) {
                  return (
                    <PrimaryButton fullWidth disabled loading>
                      Withdrawing collateral...
                    </PrimaryButton>
                  );
                }
                if (
                  !withdrawOnly &&
                  (repay.isLoading ||
                    repayAndRemoveCollateral.isLoading ||
                    borrowAmount.eq(new DecimalBigNumber("0", 18)))
                ) {
                  return (
                    <PrimaryButton fullWidth disabled>
                      Enter repayment amount
                    </PrimaryButton>
                  );
                }
              } else if (collateralAmount.eq(new DecimalBigNumber("0", 18)) && !loan) {
                return (
                  <PrimaryButton fullWidth disabled>
                    Enter collateral amount
                  </PrimaryButton>
                );
              }

              // If we get here, all conditions are met, show the TokenAllowanceGuard
              return (
                <TokenAllowanceGuard
                  tokenAddressMap={{
                    [networks.MAINNET_HOLESKY]: isRepayMode ? position.debtAddress : position.collateralAddress,
                  }}
                  spenderAddressMap={
                    interactWithComposites ? COOLER_V2_COMPOSITES_ADDRESSES : COOLER_V2_MONOCOOLER_ADDRESSES
                  }
                  isVertical
                  message={
                    <>
                      First time {isRepayMode ? "repaying" : "borrowing"}? <br /> Please approve Olympus DAO to use your{" "}
                      <b>{isRepayMode ? "USDS" : "gOHM"}</b>.
                    </>
                  }
                  spendAmount={
                    isRepayMode
                      ? borrowAmount.eq(currentDebt)
                        ? calculateRepayAmount(borrowAmount, Number(position.interestRateBps), true)
                        : borrowAmount
                      : collateralAmount.gt(new DecimalBigNumber("0", 18))
                        ? collateralAmount
                        : new DecimalBigNumber("0", 18)
                  }
                >
                  <PrimaryButton
                    fullWidth
                    onClick={() => {
                      // If multisig needs authorization, authorize first
                      if (multisigNeedsAuth) {
                        setAuthorization.mutate({});
                        return;
                      }

                      if (isRepayMode) {
                        if (withdrawOnly) {
                          withdrawCollateral.mutate({
                            amount: collateralAmount,
                          });
                        } else {
                          if (collateralToBeReleased.gt(new DecimalBigNumber("0", 18))) {
                            repayAndRemoveCollateral.mutate(
                              {
                                repayAmount: borrowAmount,
                                collateralAmount: collateralToBeReleased,
                                fullRepay: borrowAmount.eq(currentDebt),
                                isAuthorized: isAuthorized || false,
                              },
                              {
                                onSuccess: () => {
                                  resetState();
                                  setModalOpen(false);
                                },
                              },
                            );
                          } else {
                            repay.mutate(
                              {
                                amount: borrowAmount,
                                onBehalfOf: address,
                                fullRepay: borrowAmount.eq(currentDebt),
                              },
                              {
                                onSuccess: () => {
                                  resetState();
                                  setModalOpen(false);
                                },
                              },
                            );
                          }
                        }
                      } else {
                        if (collateralAmount.gt(new DecimalBigNumber("0", 18))) {
                          if (borrowAmount.gt(new DecimalBigNumber("0", 18))) {
                            addCollateralAndBorrow.mutate(
                              {
                                collateralAmount: collateralAmount,
                                borrowAmount: borrowAmount,
                                isAuthorized: isAuthorized || false,
                              },
                              {
                                onSuccess: () => {
                                  resetState();
                                  setModalOpen(false);
                                },
                              },
                            );
                          } else {
                            addCollateral.mutate(
                              {
                                amount: collateralAmount,
                              },
                              {
                                onSuccess: () => {
                                  resetState();
                                  setModalOpen(false);
                                },
                              },
                            );
                          }
                        } else {
                          borrow.mutate(
                            {
                              amount: borrowAmount,
                            },
                            {
                              onSuccess: () => {
                                resetState();
                                setModalOpen(false);
                              },
                            },
                          );
                        }
                      }
                    }}
                  >
                    {buttonText}
                  </PrimaryButton>
                </TokenAllowanceGuard>
              );
            })()}
          </WalletConnectedGuard>
        </Box>
      </>
    </Modal>
  );
};
