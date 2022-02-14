import { Box, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DottedDataRow, ProgressCircle, Slider } from "@olympusdao/component-library";
import { FC, useState } from "react";

const useStyles = makeStyles<Theme>(theme => ({}));

export interface OHMCalculatorProps {
  props?: any;
}

/**
 * Component for Displaying Calculator
 */
const Calculator: FC<OHMCalculatorProps> = () => {
  const [initialInvestment, setInitialInvestment] = useState(5000);
  const classes = useStyles();
  const currentOhmPrice = 70;
  const currentRebaseRate = 0.002037;
  const priceMultiplier = 1;
  const amountOfOhmPurchased = initialInvestment / currentOhmPrice;
  const totalsOHM = (1 + currentRebaseRate) ** 1096 * amountOfOhmPurchased;
  const usdProfit = totalsOHM * currentOhmPrice - initialInvestment;
  const pieValue = 100 - (initialInvestment / usdProfit) * 100;

  //   const projectedProfit =
  //number of EPOCHS in 365 days = 1096
  //   amountOfOHM = 1+reward rate ^ 1096 * initialOhm

  //   amountOfOhm * future price

  const handleChange: any = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setInitialInvestment(newValue);
    }
  };

  return (
    <Box>
      <Box>
        <p>Initial Investment</p>
        {initialInvestment}
      </Box>
      <Slider defaultValue={initialInvestment} min={100} max={20000} step={100} onChange={handleChange} />
      <Box display="flex" justifyContent="center" alignItems="center">
        <ProgressCircle balance={usdProfit.toString()} label="Profit" progress={pieValue} />
      </Box>
      <DottedDataRow title="Initial Investment" value={initialInvestment} />
      <DottedDataRow title="OHM Purchase Price" value={currentOhmPrice} />
      <DottedDataRow title="Amount Purchased" value={amountOfOhmPurchased} />
      <DottedDataRow title="Price Multiplier" value={priceMultiplier} />
      <DottedDataRow title="Rebase Rate" value={currentRebaseRate} />
      <DottedDataRow title="ROI" value={currentOhmPrice} />
      <DottedDataRow title="Total sOHM" value={totalsOHM} bold />
      <DottedDataRow title="Estimated Profits" value={usdProfit} bold />
    </Box>
  );
};

export default Calculator;
