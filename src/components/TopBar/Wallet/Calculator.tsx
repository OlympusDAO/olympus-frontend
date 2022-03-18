import { Box, Fade, Grid, RadioGroup, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DottedDataRow, Input, ProgressCircle, Radio, Slider } from "@olympusdao/component-library";
import { FC, useEffect, useState } from "react";
import { trim } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useSohmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useOhmPrice } from "src/hooks/usePrices";
import { useProtocolMetrics } from "src/hooks/useProtocolMetrics";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";

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
      color: theme.palette.primary.main,
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
  selector: {
    "& p": {
      fontSize: "16px",
      fontWeight: 400,
      fontFamily: "SquareMedium",
      lineHeight: "24px",
      marginRight: "18px",
      cursor: "pointer",
      color: theme.colors.gray[90],
      "&.active": {
        color: theme.palette.type === "light" ? theme.palette.primary.main : theme.colors.gray[10],
      },
      "&.active-primary": {
        color: theme.palette.type === "light" ? theme.palette.primary.main : theme.colors.primary[300],
      },
    },
    "& p:last-child": {
      marginRight: 0,
    },
  },
  radioGroup: {
    "& .MuiFormControlLabel-root:last-child": {
      marginRight: 0,
    },
  },
  targetDate: {
    fontSize: "16px",
    lineHeight: "24px",
    "& span": {
      marginLeft: "18px",
      color: theme.palette.type == "light" ? theme.colors.gray[90] : theme.colors.gray[40],
    },
  },
  ctaTitle: {
    fontWeight: 600,
    lineHeight: "24px",
    fontSize: "16px",
    marginBottom: "6px",
  },
  ctaSubtitle: {
    color: theme.colors.gray[90],
    fontWeight: 500,
    lineHeight: "20px",
  },
}));

export const initialInvestment = (quantity: number, purchasePrice: number) => {
  return quantity * purchasePrice;
};

/**
 * Component for Displaying Calculator
 */
const Calculator: FC = () => {
  const networks = useTestableNetworks();
  const { data: currentRebaseRate = 0 } = useStakingRebaseRate();
  const { data: gOhmBalance = new DecimalBigNumber("0", 18) } = useGohmBalance()[networks.MAINNET];
  const { data: sOhmBalance = new DecimalBigNumber("0", 9) } = useSohmBalance()[networks.MAINNET];
  const { data: currentIndex = new DecimalBigNumber("0", 9) } = useCurrentIndex();
  const { data: fuseBalance = new DecimalBigNumber("0", 18) } = useFuseBalance()[NetworkId.MAINNET];
  const { data: gohmTokemakBalance = new DecimalBigNumber("0", 18) } = useGohmTokemakBalance()[NetworkId.MAINNET];
  const { data: wsOhmBalance = new DecimalBigNumber("0", 18) } = useWsohmBalance()[networks.MAINNET];
  const { data: v1SohmBalance = new DecimalBigNumber("0", 9) } = useV1SohmBalance()[networks.MAINNET];

  const walletSohm =
    gOhmBalance.toApproxNumber() * currentIndex.toApproxNumber() +
    wsOhmBalance.toApproxNumber() * currentIndex.toApproxNumber() +
    fuseBalance.toApproxNumber() * currentIndex.toApproxNumber() +
    gohmTokemakBalance.toApproxNumber() * currentIndex.toApproxNumber() +
    sOhmBalance.toApproxNumber() +
    v1SohmBalance.toApproxNumber();

  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [duration, setDuration] = useState(365);
  const [multiplier, setMultiplier] = useState(1);
  const [futureOhmPrice, setFutureOhmPrice] = useState(0);
  const [manualOhmPrice, setManualOhmPrice] = useState(0);
  const [manualRebaseRate, setManualRebaseRate] = useState(0);
  const [advanced, setAdvanced] = useState(false);
  const classes = useStyles();
  const rebases = duration * 3;
  const { data: ohmPrice = 0 } = useOhmPrice();
  const { data: runwayData } = useProtocolMetrics();

  //protocol metrics hook is causing this ts error. disabling for now.
  //@ts-expect-error
  const runway = runwayData && trim(runwayData[0].runwayCurrent, 1);

  //If values are set on the Advanced view.
  const currentOhmPrice = advanced ? manualOhmPrice : ohmPrice;
  const rebaseRate = advanced ? manualRebaseRate : +trim(currentRebaseRate, 7);

  const predictedOhmPrice = futureOhmPrice > 0 ? futureOhmPrice : currentOhmPrice * multiplier;
  const amountOfOhmPurchased = initialInvestment / currentOhmPrice;
  const totalsOHM = (1 + rebaseRate) ** rebases * amountOfOhmPurchased;
  const usdProfit = totalsOHM * predictedOhmPrice - initialInvestment;
  const usdValue = totalsOHM * predictedOhmPrice;
  const pieValue = (usdProfit / (totalsOHM * predictedOhmPrice)) * 100;
  const breakEvenPrice = initialInvestment / totalsOHM;

  useEffect(() => {
    setManualRebaseRate(+trim(currentRebaseRate, 7));
  }, [currentRebaseRate]);

  useEffect(() => {
    setManualOhmPrice(+trim(ohmPrice, 2));
  }, [ohmPrice]);

  useEffect(() => {
    setInitialInvestment(walletSohm * ohmPrice);
  }, [walletSohm]);
  //Solving for duration (rebases/3) aka breakeven days
  const breakevenDays =
    (Math.log(totalsOHM / (initialInvestment / futureOhmPrice)) / Math.log(1 + rebaseRate) / 3 - duration) * -1;

  const ROI = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(usdProfit / initialInvestment);

  const formattedCurrentRebaseRate = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 4,
  }).format(rebaseRate);

  const handleChange: any = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setInitialInvestment(newValue);
    }
  };

  const handleDurationChange: any = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setDuration(newValue);
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
  const formattedBreakEvenDays = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(breakevenDays);

  const RadioSelector = () => (
    <RadioGroup
      name="multiplierGroup"
      value={multiplier}
      onChange={e => setMultiplier(Number(e.target.value))}
      row
      className={classes.radioGroup}
    >
      <Radio label="1x" value={1} />
      <Radio label="2x" value={2} />
      <Radio label="3x" value={3} />
    </RadioGroup>
  );

  const durations = [
    { days: 365, label: "12 months" },
    { days: 180, label: "6 m" },
    { days: 90, label: "3 m" },
    { days: 60, label: "2 m" },
    { days: 30, label: "1 m" },
  ];

  return (
    <Fade in={true}>
      <Box>
        <Box display="flex" flexDirection="column" mb="21px">
          <Box display="flex" flexDirection="row" className={classes.selector} mb="30px">
            <Typography
              className={!advanced ? "active-primary" : ""}
              onClick={() => {
                setAdvanced(false);
                setFutureOhmPrice(0);
              }}
            >
              Simple
            </Typography>
            <Typography className={advanced ? "active-primary" : ""} onClick={() => setAdvanced(true)}>
              Advanced
            </Typography>
          </Box>
          {!advanced && (
            <>
              <Box display="flex" justifyContent="center" mb="3px">
                <Typography className={classes.title}>Investment Amount:</Typography>
              </Box>
              <Box display="flex" justifyContent="center" mb="18px">
                <Typography className={classes.investmentAmount}>{formattedInitialInvestment}</Typography>
              </Box>
              <Box display="flex" justifyContent="center">
                <Typography className={classes.runway}>
                  Runway: <span>{runway} Days</span>
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {advanced ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  id="amount"
                  label="sOHM Amount"
                  value={amountOfOhmPurchased ? +trim(amountOfOhmPurchased, 4) : ""}
                  onChange={e => setInitialInvestment(Number(e.target.value) * currentOhmPrice)}
                  type="number"
                  inputProps={{ inputMode: "numeric" }}
                />
                <Box mt="9px">
                  <Input
                    id="purchaseAmount"
                    label="OHM Purchase Price"
                    value={currentOhmPrice}
                    onChange={e => setManualOhmPrice(Number(e.target.value))}
                    inputProps={{ inputMode: "numeric" }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Input
                  id="rebaseRate"
                  label="Rebase Rate"
                  value={rebaseRate * 100}
                  onChange={e => setManualRebaseRate(Number(e.target.value) / 100)}
                  type="number"
                  endString="%"
                  inputProps={{ inputMode: "numeric" }}
                />
                <Box mt="9px">
                  <Input
                    id="futureOhmPrice"
                    label="Future OHM Price"
                    value={futureOhmPrice > 0 ? futureOhmPrice : ""}
                    onChange={e => setFutureOhmPrice(Number(e.target.value))}
                    type="number"
                    inputProps={{ inputMode: "numeric" }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Box display="flex" flexDirection="row" justifyContent="space-between" mt="30px" mb="30px">
              <Typography className={classes.targetDate}>
                {duration} Days <span>Target date</span>
              </Typography>
              <Typography className={classes.runway}>
                Runway: <span>{runway} Days</span>
              </Typography>
            </Box>
            <Box ml="12px" mr="12px">
              <Slider value={duration} onChange={handleDurationChange} min={1} max={1825} />
            </Box>
          </>
        ) : (
          <Box ml="12px" mr="12x">
            <Slider value={initialInvestment} min={0} max={100000} step={100} onChange={handleChange} />
          </Box>
        )}
        {!advanced && (
          <>
            <Box display="flex" justifyContent="space-around" alignItems="center" mt="18px" mb="18px">
              <Box display="flex" flexDirection="column" textAlign="right" flexGrow={0.33}>
                <Typography className={classes.progressMetric}>{formattedInitialInvestment}</Typography>
                <Typography className={classes.progressLabel}>Invested</Typography>
              </Box>
              <Box position="relative">
                <ProgressCircle balance={totalValue.toString()} label="Total Value" progress={pieValue} />
              </Box>
              <Box display="flex" flexDirection="column" textAlign="left" flexGrow={0.33}>
                <Typography className={classes.progressMetric}>{formattedProfits}</Typography>
                <Typography className={classes.progressLabel}>ROI in {duration} days</Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              className={classes.selector}
              justifyContent="center"
            >
              {durations.map((dur, index) => (
                <Typography
                  key={index}
                  className={duration === dur.days ? "active" : ""}
                  onClick={() => setDuration(dur.days)}
                >
                  {dur.label}
                </Typography>
              ))}
            </Box>
          </>
        )}
        <DottedDataRow title="Initial Investment" value={formattedInitialInvestment} />
        {!advanced && <DottedDataRow title="OHM Purchase Price" value={currentOhmPrice} />}
        {!advanced && <DottedDataRow title="Amount Purchased" value={`${formattedAmountPurchased} OHM`} />}
        {!advanced && <DottedDataRow title="Price Multiplier" value={<RadioSelector />} />}
        {!advanced && <DottedDataRow title="Rebase Rate" value={formattedCurrentRebaseRate} />}
        <DottedDataRow title="ROI" value={ROI} />
        {advanced && (
          <>
            <DottedDataRow title="Breakeven Price" value={trim(breakEvenPrice, 2)} />
            <DottedDataRow
              title="Days to Breakeven"
              value={`${Number(formattedBreakEvenDays) > 0 ? formattedBreakEvenDays : 0} Days`}
            />
          </>
        )}
        <DottedDataRow title="Total sOHM" value={formattedTotalsOHM} bold />
        <DottedDataRow title="Estimated Total" value={formattedProfits} bold />
        <Box display="flex" justifyContent="center" mt={"15px"} textAlign="center">
          <p>
            This is strictly a tool to help Ohmies better estimate potential ROI. The estimates above are based on
            current market conditions and should not be interpreted as financial advice in any way
          </p>
        </Box>
      </Box>
    </Fade>
  );
};

export default Calculator;
