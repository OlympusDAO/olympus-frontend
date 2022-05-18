import { Typography } from "@mui/material";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";

export const GOHMConversion: React.FC<{ amount: string; action: "STAKE" | "UNSTAKE" }> = props => {
  const { data: currentIndex } = useCurrentIndex();

  if (!currentIndex || !props.amount || isNaN(Number(props.amount))) return null;

  const _amount = new DecimalBigNumber(props.amount, props.action === "STAKE" ? 9 : 18);

  return (
    <Typography variant="body2">
      {props.action === "STAKE"
        ? `Stake ${_amount.toString()} OHM → ${_amount.div(currentIndex, 18).toString()} gOHM`
        : `Unstake ${_amount.toString()} gOHM → ${_amount.mul(currentIndex).toString({ decimals: 9 })} OHM`}
    </Typography>
  );
};
