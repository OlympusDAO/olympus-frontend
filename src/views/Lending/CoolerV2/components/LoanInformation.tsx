import { Box, SvgIcon, Tooltip, Typography } from "@mui/material";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

interface LoanInformationProps {
  isRepayMode: boolean;
  liquidationThreshold: DecimalBigNumber;
  projectedDebt: DecimalBigNumber;
  projectedCollateral: DecimalBigNumber;
  maxPotentialBorrowAmount: DecimalBigNumber;
  additionalBorrowingAvailable: DecimalBigNumber;
  oneHourInterest: DecimalBigNumber;
}

export const LoanInformation = ({
  isRepayMode,
  liquidationThreshold,
  projectedDebt,
  projectedCollateral,
  maxPotentialBorrowAmount,
  additionalBorrowingAvailable,
  oneHourInterest,
}: LoanInformationProps) => {
  const { data: position } = useMonoCoolerPosition();

  if (!position) return null;

  return (
    <>
      <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
        <Box>Interest Rate</Box>
        <Box fontWeight="500">{formatNumber(position.interestRateBps / 1000, 2)}%</Box>
      </Box>

      <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
        <Box display="flex" alignItems="center" gap={0.5}>
          Liquidation Threshold
          <Tooltip title={"If your debt exceeds this amount, your position may be liquidated."} arrow>
            <SvgIcon sx={{ fontSize: 16, cursor: "help" }} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </SvgIcon>
          </Tooltip>
        </Box>
        <Box fontWeight="500" color={projectedDebt.gt(liquidationThreshold) ? "error.main" : "text.primary"}>
          {formatNumber(Number(liquidationThreshold), 2)} USDS
        </Box>
      </Box>

      {!isRepayMode && (
        <>
          <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
            <Box display="flex" alignItems="center" gap={0.5}>
              Max Borrow Amount
              <Tooltip title="The maximum amount you can borrow based the collateral available in your wallet." arrow>
                <SvgIcon sx={{ fontSize: 16, cursor: "help" }} viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </SvgIcon>
              </Tooltip>
            </Box>
            <Box fontWeight="500">{formatNumber(Number(maxPotentialBorrowAmount), 2)} USDS</Box>
          </Box>

          {additionalBorrowingAvailable && oneHourInterest && additionalBorrowingAvailable.gt(oneHourInterest) && (
            <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
              <Box display="flex" alignItems="center" gap={0.5}>
                Additional Borrowing Available
                <Tooltip
                  title="You can borrow more against your existing collateral without depositing additional gOHM. This amount may increase further as market conditions improve."
                  arrow
                >
                  <SvgIcon sx={{ fontSize: 16, cursor: "help" }} viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                  </SvgIcon>
                </Tooltip>
              </Box>
              <Box fontWeight="500" color="success.main">
                {formatNumber(Number(additionalBorrowingAvailable), 2)} USDS
              </Box>
            </Box>
          )}
        </>
      )}

      <Box mt="18px" mb="21px">
        <Typography variant="body2" color="textSecondary" mb={1}>
          Position After {isRepayMode ? "Repayment" : "Borrowing"}:
        </Typography>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box display="flex" alignItems="center" gap={0.5}>
            Total Debt
            <Tooltip title={`Your total debt ${isRepayMode ? "after repaying" : "including new borrowing"}`} arrow>
              <SvgIcon sx={{ fontSize: 16, cursor: "help" }} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </SvgIcon>
            </Tooltip>
          </Box>
          <Box fontWeight="500">{formatNumber(Number(projectedDebt.toString()), 2)} USDS</Box>
        </Box>
        <Box display="flex" justifyContent="space-between" fontSize="12px" mt="9px" lineHeight="15px">
          <Box display="flex" alignItems="center" gap={0.5}>
            Total Collateral
            <Tooltip
              title={`Your total collateral ${isRepayMode ? "after collateral release" : "including new deposit"}`}
              arrow
            >
              <SvgIcon sx={{ fontSize: 16, cursor: "help" }} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </SvgIcon>
            </Tooltip>
          </Box>
          <Box fontWeight="500">{formatNumber(Number(projectedCollateral.toString()), 4)} gOHM</Box>
        </Box>
      </Box>
    </>
  );
};
