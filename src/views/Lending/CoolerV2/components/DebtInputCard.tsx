import { Box, SvgIcon } from "@mui/material";
import { SwapCard } from "@olympusdao/component-library";
import { ethers } from "ethers";
import usdsIcon from "src/assets/tokens/usds.svg?react";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

interface DebtInputCardProps {
  borrowAmount: DecimalBigNumber;
  onBorrowAmountChange: (value: DecimalBigNumber) => void;
  onDebtInputChange?: (value: DecimalBigNumber) => void;
  loan?: {
    debt: ethers.BigNumber;
  };
  isRepayMode: boolean;
  disabled?: boolean;
}

export const DebtInputCard = ({
  borrowAmount,
  onBorrowAmountChange,
  onDebtInputChange,
  loan,
  isRepayMode,
  disabled,
}: DebtInputCardProps) => {
  const networks = useTestableNetworks();
  const { data: position } = useMonoCoolerPosition();
  const { data: debtBalance } = useBalance({ [networks.MAINNET_HOLESKY]: position?.debtAddress || "" })[
    networks.MAINNET_HOLESKY
  ];

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
      info={
        loan && isRepayMode
          ? `Total Debt: ${formatNumber(Number(ethers.utils.formatUnits(loan.debt)), 4)} USDS`
          : `Balance: ${debtBalance?.toString({ decimals: 4 }) || "0"} USDS`
      }
      endString={isRepayMode ? "Max" : ""}
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
