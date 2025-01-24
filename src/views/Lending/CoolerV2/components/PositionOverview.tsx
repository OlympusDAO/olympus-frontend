import { Box, Typography, useTheme } from "@mui/material";
import { DataRow } from "@olympusdao/component-library";
import { formatUnits } from "ethers/lib/utils";
import { useMemo } from "react";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

export const PositionOverview = () => {
  const theme = useTheme();
  const { data: position } = useMonoCoolerPosition();

  const healthColor = useMemo(() => {
    if (!position) return theme.colors.feedback.success;
    const healthFactor = Number(formatUnits(position.healthFactor, 18));
    if (healthFactor > 2) return theme.colors.feedback.success;
    if (healthFactor > 1.5) return theme.colors.feedback.warning;
    return theme.colors.feedback.error;
  }, [position, theme]);

  const projectedLiquidationDate = useMemo(() => {
    if (!position || !position.currentDebt || !position.collateral || !position.interestRateBps) return null;

    // Convert interest rate from basis points to decimal (1 bp = 0.0001)
    const annualRate = Number(position.interestRateBps) / 10000;
    const currentLtv = Number(formatUnits(position.currentLtv, 18));
    const liquidationLtv = Number(formatUnits(position.liquidationLtv, 18));

    // If already at or above liquidation LTV, return now
    if (currentLtv >= liquidationLtv) return new Date();

    // Calculate time until liquidation using continuous compound interest formula
    // liquidationLtv = currentLtv * e^(r*t)
    // t = ln(liquidationLtv/currentLtv) / r
    const timeInYears = Math.log(liquidationLtv / currentLtv) / annualRate;
    const timeInMilliseconds = timeInYears * 365 * 24 * 60 * 60 * 1000;

    return new Date(Date.now() + timeInMilliseconds);
  }, [position]);

  if (!position) return null;

  return (
    <Box>
      <DataRow title="Collateral" balance={`${formatUnits(position.collateral, 18)} gOHM`} />
      <DataRow title="Current Debt" balance={`${formatUnits(position.currentDebt, 18)} USDS`} />
      <DataRow title="Current LTV" balance={`${(Number(formatUnits(position.currentLtv, 18)) * 100).toFixed(2)}%`} />
      <DataRow
        title="Health Factor"
        balance={
          <Typography sx={{ color: healthColor }}>
            {Number(formatUnits(position.healthFactor, 18)).toFixed(2)}
          </Typography>
        }
      />
      <DataRow title="Max Borrow" balance={`${formatUnits(position.maxOriginationDebtAmount, 18)} USDS`} />
      <DataRow
        title="Liquidation Threshold"
        balance={`${(Number(formatUnits(position.liquidationLtv, 18)) * 100).toFixed(2)}%`}
      />
      <DataRow title="Interest Rate" balance={`${(Number(position.interestRateBps) / 100).toFixed(2)}%`} />
      <DataRow title="Total Delegated" balance={`${formatUnits(position.totalDelegated, 18)} gOHM`} />
      {projectedLiquidationDate && (
        <DataRow
          title="Projected Liquidation"
          balance={`${projectedLiquidationDate.toLocaleDateString([], {
            month: "long",
            day: "numeric",
            year: "numeric",
          })} at ${projectedLiquidationDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        />
      )}
    </Box>
  );
};
