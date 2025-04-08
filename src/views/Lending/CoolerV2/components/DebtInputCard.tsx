import { Box, SvgIcon } from "@mui/material";
import { SwapCard } from "@olympusdao/component-library";
import { ethers } from "ethers";
import usdsIcon from "src/assets/tokens/usds.svg?react";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
interface DebtInputCardProps {
  borrowAmount: DecimalBigNumber;
  onBorrowAmountChange: (value: DecimalBigNumber) => void;
  onDebtInputChange?: (value: DecimalBigNumber) => void;
  loan?: {
    debt: ethers.BigNumber;
  };
  isRepayMode: boolean;
  disabled?: boolean;
  walletBalance?: DecimalBigNumber;
}

export const DebtInputCard = ({
  borrowAmount,
  onBorrowAmountChange,
  onDebtInputChange,
  loan,
  isRepayMode,
  disabled,
  walletBalance,
}: DebtInputCardProps) => {
  const getInfoText = () => {
    if (loan && isRepayMode) {
      return `
        ${walletBalance && `Balance: ${walletBalance.toString({ decimals: 4 })} USDS`}`;
    }
    return "Debt to Borrow";
  };

  return (
    <SwapCard
      id="debt-input"
      token={
        <Box display="flex" gap="9px" alignItems="center">
          <SvgIcon color="primary" sx={{ width: "20px", height: "20px" }} viewBox="0 0 50 50" component={usdsIcon} />
        </Box>
      }
      tokenName="USDS"
      value={borrowAmount.toString()}
      onChange={e => {
        const value = new DecimalBigNumber(e.target.value, 18);
        onBorrowAmountChange(value);
        if (!isRepayMode) {
          onDebtInputChange?.(value);
        }
      }}
      info={getInfoText()}
      endString={isRepayMode ? "Repay All" : ""}
      endStringOnClick={
        loan && isRepayMode
          ? () => {
              const totalDebt = new DecimalBigNumber(loan.debt, 18);
              onBorrowAmountChange(totalDebt);
              if (!isRepayMode) {
                onDebtInputChange?.(totalDebt);
              }
            }
          : undefined
      }
      inputProps={{
        "data-testid": "debt-input",
        disabled,
      }}
    />
  );
};
