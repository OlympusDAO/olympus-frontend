import { Typography } from "@material-ui/core";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";

export const GOHMConversion: React.FC<{ amount: string; action: "STAKE" | "UNSTAKE" }> = props => {
  const { data: currentIndex } = useCurrentIndex();

  if (!currentIndex || !props.amount || isNaN(Number(props.amount))) return null;

  const _amount = new DecimalBigNumber(props.amount, props.action === "STAKE" ? 9 : 18);

  return (
    <Typography variant="body2">
      {props.action === "STAKE"
        ? `Stake ${_amount.toAccurateString()} OHM → ${_amount.div(currentIndex, 18).toAccurateString()} gOHM`
        : `Unstake ${_amount.toAccurateString()} gOHM → ${_amount.mul(currentIndex, 9).toAccurateString()} OHM`}
    </Typography>
  );
};
