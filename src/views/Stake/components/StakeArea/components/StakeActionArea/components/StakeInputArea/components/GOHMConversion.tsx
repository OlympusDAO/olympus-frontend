import { Box, Typography } from "@material-ui/core";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { convertGohmToOhm, convertOhmToGohm } from "src/helpers";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";

export const GOHMConversion: React.FC<{ amount: string; action: "STAKE" | "UNSTAKE" }> = props => {
  const { data: currentIndex } = useCurrentIndex();

  if (!currentIndex) return null;

  const convertOhm = (amount: string) => formatUnits(convertOhmToGohm(parseUnits(amount, 9), currentIndex), 9);
  const convertGohm = (amount: string) => formatUnits(convertGohmToOhm(parseUnits(amount, 18), currentIndex), 18);

  return (
    <Box flexShrink={0}>
      <Typography variant="body2">
        {props.action === "STAKE"
          ? `Stake ${props.amount} OHM → ${convertOhm(props.amount)} gOHM`
          : `Unstake ${props.amount} gOHM → ${convertGohm(props.amount)} OHM`}
      </Typography>
    </Box>
  );
};
