import { Typography } from "@material-ui/core";
import { convertGohmToOhm, convertOhmToGohm } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";

export const GOHMConversion: React.FC<{ amount: string; action: "STAKE" | "UNSTAKE" }> = props => {
  const { data: currentIndex } = useCurrentIndex();

  if (!currentIndex || !props.amount || isNaN(Number(props.amount))) return null;

  // We only ever care about the first 9 decimals to prevent underflow errors
  const [integer, decimals] = props.amount.split(".");
  const _amount = decimals ? `${integer}.${decimals.substring(0, 9)}` : integer;

  const parsedAmount = new DecimalBigNumber(_amount, props.action === "STAKE" ? 9 : 18);

  return (
    <Typography variant="body2">
      {props.action === "STAKE"
        ? `Stake ${props.amount} OHM → ${convertOhmToGohm(parsedAmount, currentIndex).toAccurateString()} gOHM`
        : `Unstake ${props.amount} gOHM → ${convertGohmToOhm(parsedAmount, currentIndex).toFormattedString(9)} OHM`}
    </Typography>
  );
};
