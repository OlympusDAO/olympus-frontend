import { styled, useTheme } from "@mui/material/styles";
import { DataRow, Paper } from "@olympusdao/component-library";
import { Area, ComposedChart, Label, Line, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, parseBigNumber, trim } from "src/helpers";

import { PriceHistory } from "./hooks";

const PREFIX = "RangeChart";

const classes = {
  currentPrice: `${PREFIX}-currentPrice`,
};

const StyledResponsiveContainer = styled(ResponsiveContainer)(({ theme }) => ({
  [`& .${classes.currentPrice}`]: {
    fill: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

/**
 * Component for Displaying RangeChart
 */
const RangeChart = (props: {
  rangeData: any;
  currentPrice: number;
  bidPrice: number;
  askPrice: number;
  sellActive: boolean;
  reserveSymbol: string;
}) => {
  const { rangeData, currentPrice, bidPrice, askPrice, sellActive, reserveSymbol } = props;
  //TODO - Figure out which Subgraphs to query. Currently Uniswap.
  const { data: priceData } = PriceHistory(reserveSymbol);
  console.log(rangeData, "rangedata");

  const formattedWallHigh = trim(parseBigNumber(rangeData.wall.high.price, 18), 2);
  const formattedWallLow = trim(parseBigNumber(rangeData.wall.low.price, 18), 2);
  const formattedCushionHigh = trim(parseBigNumber(rangeData.cushion.high.price, 18), 2);
  const formattedCushionLow = trim(parseBigNumber(rangeData.cushion.low.price, 18), 2);
  const chartData = priceData.map((item: any) => {
    return {
      ...item,
      uv: [formattedWallHigh, formattedCushionHigh],
      lv: [formattedWallLow, formattedCushionLow],
    };
  });

  /* We load an object at the front of the chartData array
   * with no price data to shift the chart line left and add an extra element with current market price
   */
  chartData.unshift(
    {
      uv: [formattedWallHigh, formattedCushionHigh],
      lv: [formattedWallLow, formattedCushionLow],
    },
    {
      price: currentPrice,
      timestamp: "now",
      uv: [formattedWallHigh, formattedCushionHigh],
      lv: [formattedWallLow, formattedCushionLow],
    },
  );

  console.log(chartData);

  const CustomReferenceDot = (props: {
    cx: string | number | undefined;
    cy: string | number | undefined;
    fill: string;
  }) => {
    return (
      <>
        <circle cx={props.cx} cy={props.cy} fill={props.fill} r="8"></circle>
        <circle cx={props.cx} cy={props.cy} fill={props.fill} r="8">
          <animate
            attributeName="opacity"
            keyTimes="0; .5; 1"
            values="0; 1; 0"
            dur="1.5s"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate attributeName="r" keyTimes="0; 1" values="8; 20" dur="1.5s" begin="0s" repeatCount="indefinite" />
        </circle>
      </>
    );
  };

  const TooltipContent = () => (
    <Paper className={`ohm-card tooltip-container`} childPaperBackground>
      <DataRow title="Price" balance={formatCurrency(currentPrice, 2)} />
      <DataRow title="Upper Wall" balance={formatCurrency(parseBigNumber(rangeData.wall.high.price, 18), 2)} />
      <DataRow title="Upper Cushion" balance={formatCurrency(parseBigNumber(rangeData.cushion.high.price, 18), 2)} />
      <DataRow title="Lower Cushion" balance={formatCurrency(parseBigNumber(rangeData.cushion.low.price, 18), 2)} />
      <DataRow title="Lower Wall" balance={formatCurrency(parseBigNumber(rangeData.wall.low.price, 18), 2)} />
    </Paper>
  );

  const theme = useTheme();
  return (
    <StyledResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <XAxis reversed scale="auto" dataKey="timestamp" />
        <YAxis scale="auto" domain={[(dataMin: number) => dataMin, "dataMax"]} />
        <Tooltip content={<TooltipContent />} />
        <Area
          type="monotone"
          dataKey="uv"
          fill={rangeData.high.active ? theme.colors.feedback.error : theme.colors.gray[500]}
          stroke={rangeData.high.active ? theme.colors.feedback.error : theme.colors.gray[500]}
          strokeDasharray={"6 3"}
          strokeWidth={2}
          fillOpacity={0.4}
        />
        <Area
          type="linear"
          fill={rangeData.low.active ? theme.colors.feedback.success : theme.colors.gray[500]}
          dataKey="lv"
          stroke={rangeData.low.active ? theme.colors.feedback.success : theme.colors.gray[500]}
          dot={false}
          strokeDasharray="6 3"
          strokeWidth={2}
          fillOpacity={0.4}
        />
        <Line type="monotone" dataKey="price" stroke="#fafafa" dot={false} strokeWidth={4} />
        <ReferenceDot
          x={chartData.length > 1 && chartData[1].timestamp}
          y={chartData.length > 1 && chartData[1].price}
          shape={CustomReferenceDot}
          fill="#ffffff"
        >
          <Label className={classes.currentPrice} color="#fff" position={"right"}>
            {formatCurrency(chartData.length > 1 && chartData[1].price, 2)}
          </Label>
        </ReferenceDot>
        {!sellActive && (
          <ReferenceDot
            x={chartData.length > 1 && chartData[1].timestamp}
            //TODO: replace w/ bond price if were in the cushion
            y={askPrice}
            shape={CustomReferenceDot}
            fill="#F8CC82"
          >
            <Label className={classes.currentPrice} color="#fff" position={"right"}>
              Ask: {formatCurrency(askPrice, 2)}
            </Label>
          </ReferenceDot>
        )}
        {sellActive && (
          <ReferenceDot
            x={chartData.length > 1 && chartData[1].timestamp}
            //TODO: replace w/ bond price if were in the cushion
            y={bidPrice}
            shape={CustomReferenceDot}
            fill="#F8CC82"
          >
            <Label className={classes.currentPrice} color="#fff" position={"right"}>
              Bid: {formatCurrency(bidPrice, 2)}
            </Label>
          </ReferenceDot>
        )}
      </ComposedChart>
    </StyledResponsiveContainer>
  );
};

export default RangeChart;
