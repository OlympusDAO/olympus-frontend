import { Typography, LinearProgress } from "@material-ui/core";
interface StackProgressProps {}

// TODO Get current balance
// TODO reward
// TODO time to next rebase
// TODO usd price
// TODO toggler ohm <=> usd
// TODO highlight current value, next value after rebase, value in between, update each 100ms

export const StackProgress = ({}: StackProgressProps) => {
  return (
    <>
      <Typography variant="h6">Stake in progress</Typography>
      <LinearProgress variant="determinate" value={50} />
    </>
  );
};
