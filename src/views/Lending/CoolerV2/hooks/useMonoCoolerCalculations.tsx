import { ethers } from "ethers";
import { useMemo, useState } from "react";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

interface UseMonoCoolerCalculationsProps {
  loan?: {
    debt: ethers.BigNumber;
    collateral: ethers.BigNumber;
  };
  isRepayMode: boolean;
}

export const useMonoCoolerCalculations = ({ loan, isRepayMode }: UseMonoCoolerCalculationsProps) => {
  const { data: position } = useMonoCoolerPosition();
  const networks = useTestableNetworks();
  const { data: collateralBalance } = useBalance({ [networks.MAINNET_HOLESKY]: position?.collateralAddress || "" })[
    networks.MAINNET_HOLESKY
  ];

  // Move state into the hook
  const [collateralAmount, setCollateralAmount] = useState(new DecimalBigNumber("0", 18));

  // Calculate hourly interest rate once
  const hourlyInterestRate = useMemo(() => {
    if (!position?.interestRateBps) return 0;
    return position.interestRateBps / 10000 / 8760;
  }, [position?.interestRateBps]);

  const [borrowAmount, setBorrowAmount] = useState<DecimalBigNumber>(() => {
    if (!loan || !position?.maxOriginationLtv || hourlyInterestRate === 0) return new DecimalBigNumber("0", 18);

    if (isRepayMode) {
      return new DecimalBigNumber(loan.debt, 18);
    } else if (loan) {
      // In borrow mode with existing loan, show the additional borrowing available
      const maxBorrow = new DecimalBigNumber(loan.collateral, 18).mul(
        new DecimalBigNumber(position.maxOriginationLtv, 18),
      );

      const currentDebt = new DecimalBigNumber(loan.debt, 18);
      const additionalBorrowing = maxBorrow.sub(currentDebt);

      // Calculate one hour's interest
      const oneHourInterest = currentDebt.mul(new DecimalBigNumber(hourlyInterestRate.toFixed(18)));

      // If additional borrowing is less than or equal to one hour's interest, return zero
      return additionalBorrowing.gt(oneHourInterest) ? additionalBorrowing : new DecimalBigNumber("0", 18);
    }
    return new DecimalBigNumber("0", 18);
  });

  const [ltvPercentage, setLtvPercentage] = useState(100);

  // Current debt calculation
  const currentDebt = useMemo(() => {
    if (!loan) return new DecimalBigNumber("0", 18);
    return new DecimalBigNumber(loan.debt, 18);
  }, [loan]);

  // Store the last valid borrow amount to prevent flashing
  const lastValidBorrowAmount = useMemo(() => borrowAmount, [borrowAmount]);

  // Max potential borrow amount
  const maxPotentialBorrowAmount = useMemo(() => {
    if (!position?.maxOriginationLtv) return new DecimalBigNumber("0", 18);

    // For new positions, use the collateral balance
    if (!loan) {
      if (!collateralBalance) return new DecimalBigNumber("0", 18);
      return collateralBalance.mul(new DecimalBigNumber(position.maxOriginationLtv, 18));
    }

    // For existing positions, only use the current loan's collateral
    return new DecimalBigNumber(loan.collateral, 18).mul(new DecimalBigNumber(position.maxOriginationLtv, 18));
  }, [position?.maxOriginationLtv, loan, collateralBalance]);

  // Liquidation threshold calculation
  const liquidationThreshold = useMemo(() => {
    if (!position?.liquidationLtv) return new DecimalBigNumber("0", 18);

    if (isRepayMode && loan) {
      const existingCollateral = new DecimalBigNumber(loan.collateral, 18);
      if (currentDebt.eq(new DecimalBigNumber("0", 18))) {
        return new DecimalBigNumber("0", 18);
      }
      const repaymentRatio = borrowAmount.div(currentDebt);
      const remainingCollateral = existingCollateral.sub(existingCollateral.mul(repaymentRatio));
      return remainingCollateral.mul(new DecimalBigNumber(position.liquidationLtv, 18));
    }

    const existingCollateral = loan ? new DecimalBigNumber(loan.collateral, 18) : new DecimalBigNumber("0", 18);
    const totalCollateral = existingCollateral.add(collateralAmount);
    return totalCollateral.mul(new DecimalBigNumber(position.liquidationLtv, 18));
  }, [loan, collateralAmount, position?.liquidationLtv, isRepayMode, borrowAmount, currentDebt]);

  // Health factor calculation
  const healthFactor = useMemo(() => {
    if (!position?.liquidationLtv) return 0;

    let currentDebtAmount = borrowAmount;
    let currentCollateralAmount = collateralAmount;

    if (loan && borrowAmount.eq(new DecimalBigNumber(loan.debt, 18))) {
      currentDebtAmount = new DecimalBigNumber(loan.debt, 18);
      currentCollateralAmount = new DecimalBigNumber(loan.collateral, 18);
    }

    if (currentDebtAmount.eq(new DecimalBigNumber("0", 18))) return Number.MAX_VALUE;

    const liquidationLtvDecimal = Number(ethers.utils.formatUnits(position.liquidationLtv, 18));
    return (liquidationLtvDecimal * Number(currentCollateralAmount)) / Number(currentDebtAmount);
  }, [position?.liquidationLtv, collateralAmount, borrowAmount, loan]);

  // Collateral to be released calculation
  const collateralToBeReleased = useMemo(() => {
    if (!loan || !position?.maxOriginationLtv) return new DecimalBigNumber("0", 18);

    if (isRepayMode) {
      const existingCollateral = new DecimalBigNumber(loan.collateral, 18);
      const existingDebt = new DecimalBigNumber(loan.debt, 18);

      // Calculate what percentage of debt is being repaid
      const repaymentRatio = borrowAmount.div(existingDebt);
      // Maximum collateral that can be withdrawn is proportional to debt being repaid
      const maxCollateralToWithdraw = existingCollateral.mul(repaymentRatio);

      // Use the LTV percentage to determine how much of the available collateral to release
      const withdrawRatio = ltvPercentage / 100;
      return maxCollateralToWithdraw.mul(new DecimalBigNumber(withdrawRatio.toString()));
    }

    const totalDebt = new DecimalBigNumber(loan.debt, 18);
    if (totalDebt.eq(new DecimalBigNumber("0", 18))) {
      return new DecimalBigNumber(loan.collateral, 18);
    }
    const repaymentRatio = borrowAmount.div(totalDebt);
    return new DecimalBigNumber(loan.collateral, 18).mul(repaymentRatio);
  }, [loan, borrowAmount, position?.maxOriginationLtv, isRepayMode, ltvPercentage]);

  // One hour interest calculation
  const oneHourInterest = useMemo(() => {
    if (!currentDebt || hourlyInterestRate === 0) return new DecimalBigNumber("0", 18);
    return currentDebt.mul(new DecimalBigNumber(hourlyInterestRate.toFixed(18)));
  }, [hourlyInterestRate, currentDebt]);

  // Projected values
  const projectedDebt = useMemo(() => {
    if (isRepayMode) {
      return currentDebt.sub(lastValidBorrowAmount);
    }

    // For new positions, just use the borrowAmount
    if (!loan) {
      return lastValidBorrowAmount;
    }

    // For existing positions, add new borrowing to current debt
    return currentDebt.add(lastValidBorrowAmount);
  }, [isRepayMode, currentDebt, lastValidBorrowAmount, loan]);

  const projectedCollateral = useMemo(() => {
    if (isRepayMode) {
      if (!loan) return new DecimalBigNumber("0", 18);

      const existingCollateral = new DecimalBigNumber(loan.collateral, 18);

      // Calculate how much collateral will be withdrawn
      const collateralBeingWithdrawn = collateralToBeReleased;

      // Remaining collateral is the existing collateral minus what's being withdrawn
      return existingCollateral.sub(collateralBeingWithdrawn);
    }

    // For new positions or additional borrowing, show the total collateral that will be locked
    if (!loan) {
      return collateralAmount;
    }

    // For existing positions, add new collateral to existing
    const existingCollateral = new DecimalBigNumber(loan.collateral, 18);
    return existingCollateral.add(collateralAmount);
  }, [loan, isRepayMode, collateralAmount, collateralToBeReleased]);

  const handleRepayLtvChange = (value: number) => {
    if (!position?.maxOriginationLtv || !loan) return;

    // Set the LTV percentage first
    setLtvPercentage(value);

    // In repay mode, the borrow amount (repayment) stays constant
    // and we adjust how much collateral to release based on the slider
    const existingCollateral = new DecimalBigNumber(loan.collateral, 18);
    const existingDebt = new DecimalBigNumber(loan.debt, 18);

    // Calculate what percentage of debt is being repaid
    const repaymentRatio = borrowAmount.div(existingDebt);

    // Maximum collateral that can be withdrawn is proportional to debt being repaid
    const maxCollateralToWithdraw = existingCollateral.mul(repaymentRatio);

    // Use the slider value to determine how much of the available collateral to release
    const withdrawRatio = value / 100;
    const collateralToRelease = maxCollateralToWithdraw.mul(new DecimalBigNumber(withdrawRatio.toString()));

    // Update collateral amount to reflect how much will be withdrawn
    setCollateralAmount(collateralToRelease);
  };

  const handleBorrowLtvChange = (value: number) => {
    if (!position?.maxOriginationLtv || hourlyInterestRate === 0) return;

    const maxLtv = new DecimalBigNumber(position.maxOriginationLtv, 18);

    if (loan) {
      const existingCollateral = new DecimalBigNumber(loan.collateral, 18);
      const totalCollateral = existingCollateral.add(collateralAmount);

      // Calculate minimum LTV needed to maintain current debt
      const minLtvPercentage = Number(currentDebt.div(totalCollateral.mul(maxLtv)).mul(new DecimalBigNumber("100")));
      const adjustedValue = Math.max(value, minLtvPercentage);
      setLtvPercentage(adjustedValue);

      // If we're at the minimum LTV, set borrow amount to zero
      if (adjustedValue === minLtvPercentage) {
        setBorrowAmount(new DecimalBigNumber("0", 18));
        return;
      }

      const percentageDecimal = new DecimalBigNumber((adjustedValue / 100).toFixed(18));
      const maxBorrowAmount = totalCollateral.mul(maxLtv).mul(percentageDecimal);

      // Calculate additional borrowing, subtracting one hour's interest if at 100%
      const additionalBorrowing = maxBorrowAmount.sub(currentDebt);
      if (value === 100) {
        const oneHourInterest = currentDebt.mul(new DecimalBigNumber(hourlyInterestRate.toFixed(18)));
        setBorrowAmount(
          additionalBorrowing.gt(oneHourInterest)
            ? additionalBorrowing.sub(oneHourInterest)
            : new DecimalBigNumber("0", 18),
        );
      } else {
        setBorrowAmount(additionalBorrowing);
      }
    } else {
      setLtvPercentage(value);
      const percentageDecimal = (value / 100).toString();
      let newBorrowAmount = collateralAmount.mul(maxLtv).mul(new DecimalBigNumber(percentageDecimal));

      // If at 100% LTV, subtract one hour's interest
      if (value === 100) {
        const oneHourInterest = newBorrowAmount.mul(new DecimalBigNumber(hourlyInterestRate.toFixed(18)));
        newBorrowAmount = newBorrowAmount.gt(oneHourInterest)
          ? newBorrowAmount.sub(oneHourInterest)
          : new DecimalBigNumber("0", 18);
      }

      setBorrowAmount(newBorrowAmount);
    }
  };

  const handleLtvChange = (value: number) => {
    if (isRepayMode) {
      handleRepayLtvChange(value);
    } else {
      handleBorrowLtvChange(value);
    }
  };

  const handleCollateralChange = (value: DecimalBigNumber) => {
    setCollateralAmount(value);
    // Always update collateral amount
    if (position?.maxOriginationLtv && !isRepayMode) {
      const maxLtv = new DecimalBigNumber(position.maxOriginationLtv, 18);
      const percentageDecimal = (ltvPercentage / 100).toString();
      const newBorrowAmount = value.mul(maxLtv).mul(new DecimalBigNumber(percentageDecimal));
      setBorrowAmount(newBorrowAmount);
    }
  };

  const handleDebtChange = (value: DecimalBigNumber) => {
    if (isRepayMode) {
      // In repay mode, limit the input to not exceed current debt
      const maxRepayment = currentDebt;
      const validValue = value.gt(maxRepayment) ? maxRepayment : value;
      setBorrowAmount(validValue);
    } else {
      // In borrow mode, keep existing logic
      setBorrowAmount(value);

      if (!position?.maxOriginationLtv) return;
      const maxLtv = new DecimalBigNumber(position.maxOriginationLtv, 18);

      if (loan) {
        // For existing loans, only update LTV if we're using additional borrowing capacity
        if (!value.gt(maxPotentialBorrowAmount.sub(currentDebt))) {
          const existingCollateral = new DecimalBigNumber(loan.collateral, 18);
          const totalCollateral = existingCollateral.add(collateralAmount);
          const totalDebt = currentDebt.add(value);

          // Calculate new LTV percentage: (totalDebt / (totalCollateral * maxLtv)) * 100
          const newLtvPercentage = Number(totalDebt.div(totalCollateral.mul(maxLtv)).mul(new DecimalBigNumber("100")));
          setLtvPercentage(newLtvPercentage);
          return;
        }
      } else {
        // For new loans, calculate LTV based on input value and current collateral
        if (collateralAmount.gt(new DecimalBigNumber("0", 18))) {
          const newLtvPercentage = Number(value.div(collateralAmount.mul(maxLtv)).mul(new DecimalBigNumber("100")));
          setLtvPercentage(newLtvPercentage);
        }
      }

      // Update collateral if needed (when exceeding additional borrowing capacity)
      const percentageDecimal = (ltvPercentage / 100).toString();
      const newCollateralAmount = value.div(maxLtv).div(new DecimalBigNumber(percentageDecimal));
      setCollateralAmount(newCollateralAmount);
    }
  };

  const resetState = () => {
    setCollateralAmount(new DecimalBigNumber("0", 18));
    setBorrowAmount(new DecimalBigNumber("0", 18));
    setLtvPercentage(100);
  };

  return {
    // State
    collateralAmount,
    borrowAmount,
    ltvPercentage,

    // Calculations
    currentDebt,
    maxPotentialBorrowAmount,
    liquidationThreshold,
    healthFactor,
    collateralToBeReleased,
    oneHourInterest,
    projectedDebt,
    projectedCollateral,
    currentLtvPercentage: ltvPercentage,
    additionalBorrowingAvailable: maxPotentialBorrowAmount.gt(currentDebt)
      ? maxPotentialBorrowAmount.sub(currentDebt)
      : new DecimalBigNumber("0", 18),

    // State handlers
    handleLtvChange,
    handleCollateralChange,
    handleDebtChange,
    resetState,
  };
};
