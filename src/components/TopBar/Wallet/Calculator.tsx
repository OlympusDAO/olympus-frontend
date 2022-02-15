import { Box, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DottedDataRow, ProgressCircle, Slider } from "@olympusdao/component-library";
import { FC, useState } from "react";

const useStyles = makeStyles<Theme>(theme => ({
  title: {
    color: theme.colors.gray[40],
    lineHeight: "18px",
    fontWeight: 400,
  },
  investmentAmount: {
    fontSize: "30px",
    lineHeight: "38px",
    fontWeight: 600,
  },
  runway: {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 400,
    color: theme.colors.gray[90],
    " & span": {
      color: theme.colors.gray[10],
    },
  },
  progressMetric: {
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: 600,
  },
  progressLabel: {
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: 400,
    color: theme.colors.gray[90],
  },
  duration: {
    "& p": {
      fontSize: "16px",
      fontWeight: 400,
      fontFamily: "SquareMedium",
      lineHeight: "24px",
      marginRight: "18px",
      cursor: "pointer",
    },
    "& p:last-child": {
      marginRight: 0,
    },
  },
}));

export interface OHMCalculatorProps {
  props?: any;
}

/**
 * Component for Displaying Calculator
 */
const Calculator: FC<OHMCalculatorProps> = () => {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [duration, setDuration] = useState(365);
  const classes = useStyles();
  const rebases = duration * 3;
  const currentOhmPrice = 70;
  const currentRebaseRate = 0.002037;
  const priceMultiplier = 1;
  const amountOfOhmPurchased = initialInvestment / currentOhmPrice;
  const totalsOHM = (1 + currentRebaseRate) ** rebases * amountOfOhmPurchased;
  const usdProfit = totalsOHM * currentOhmPrice - initialInvestment;
  const usdValue = totalsOHM * currentOhmPrice;
  const pieValue = (usdProfit / (totalsOHM * currentOhmPrice)) * 100;
  const ROI = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(usdProfit / initialInvestment);

  const formattedCurrentRebaseRate = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 4,
  }).format(currentRebaseRate);

  const handleChange: any = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setInitialInvestment(newValue);
    }
  };
  const usdPie = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const ohm = new Intl.NumberFormat("en-US", {
    style: "decimal",
  });
  const totalValue = usdPie.format(usdValue);
  const formattedProfits = usd.format(usdProfit);
  const formattedInitialInvestment = usd.format(initialInvestment);
  const formattedTotalsOHM = ohm.format(totalsOHM);
  const formattedAmountPurchased = ohm.format(amountOfOhmPurchased);

  return (
    <Box>
      <Box display="flex" flexDirection="column" mb="21px">
        <Box display="flex" justifyContent="center" mb="3px">
          <Typography className={classes.title}>Investment Amount:</Typography>
        </Box>
        <Box display="flex" justifyContent="center" mb="18px">
          <Typography className={classes.investmentAmount}>{formattedInitialInvestment}</Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography className={classes.runway}>
            Runway: <span>311.5 Days</span>
          </Typography>
        </Box>
      </Box>
      <Slider value={initialInvestment} min={500} max={100000} step={100} onChange={handleChange} />
      <Box display="flex" justifyContent="space-around" alignItems="center" mt="18px" mb="18px">
        <Box display="flex" flexDirection="column" textAlign="right">
          <Typography className={classes.progressMetric}>{formattedInitialInvestment}</Typography>
          <Typography className={classes.progressLabel}>Invested</Typography>
        </Box>
        <ProgressCircle balance={totalValue.toString()} label="Total Value" progress={pieValue} />
        <Box display="flex" flexDirection="column" textAlign="left">
          <Typography className={classes.progressMetric}>{formattedProfits}</Typography>
          <Typography className={classes.progressLabel}>ROI in</Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" className={classes.duration} justifyContent="center">
        <Typography onClick={() => setDuration(365)}>12 months</Typography>
        <Typography onClick={() => setDuration(180)}>6m</Typography>
        <Typography onClick={() => setDuration(90)}>3m</Typography>
        <Typography onClick={() => setDuration(60)}>2m</Typography>
        <Typography onClick={() => setDuration(30)}>1m</Typography>
      </Box>
      <DottedDataRow title="Initial Investment" value={formattedInitialInvestment} />
      <DottedDataRow title="OHM Purchase Price" value={currentOhmPrice} />
      <DottedDataRow title="Amount Purchased" value={`${formattedAmountPurchased} OHM`} />
      <DottedDataRow title="Price Multiplier" value={priceMultiplier} />
      <DottedDataRow title="Rebase Rate" value={formattedCurrentRebaseRate} />
      <DottedDataRow title="ROI" value={ROI} />
      <DottedDataRow title="Total sOHM" value={formattedTotalsOHM} bold />
      <DottedDataRow title="Estimated Profits" value={formattedProfits} bold />
    </Box>
  );
};

export default Calculator;
