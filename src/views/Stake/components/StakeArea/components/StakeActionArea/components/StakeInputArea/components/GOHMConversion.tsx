import { Typography } from "@material-ui/core";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { convertGohmToOhm, convertOhmToGohm } from "src/helpers";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";

export const GOHMConversion: React.FC<{ amount: string; action: "STAKE" | "UNSTAKE" }> = props => {
  const { data: currentIndex } = useCurrentIndex();

  if (!currentIndex || !props.amount || isNaN(Number(props.amount))) return null;

  const [integer, decimals] = props.amount.split(".");

  // We only ever care about the first 9 decimals to prevent underflow errors
  const _amount = decimals ? `${integer}.${decimals.substring(0, 9)}` : integer;

  const amountInGohm = (amount: string) => formatUnits(convertOhmToGohm(parseUnits(amount), currentIndex));
  const amountInSohm = (amount: string) => formatUnits(convertGohmToOhm(parseUnits(amount, 18), currentIndex), 18);

  return (
    <Typography variant="body2">
      {props.action === "STAKE"
        ? `Stake ${props.amount} OHM → ${amountInGohm(_amount)} gOHM`
        : `Unstake ${props.amount} gOHM → ${amountInSohm(_amount)} OHM`}
    </Typography>
  );
};
