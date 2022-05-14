import { makeStyles, Theme } from "@material-ui/core";
import { DataRow, Paper } from "@olympusdao/component-library";
import { Area, ComposedChart, Label, Line, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "src/helpers";

import { PriceHistory } from "./hooks";

//export interface OHMRangeChartProps {}

const useStyles = makeStyles<Theme>(theme => ({
  currentPrice: {
    fill: theme.palette.primary.main,
    fontWeight: 600,
  },
}));
/**
 * Component for Displaying RangeChart
 */
const RangeChart = (props: { rangeBoundaries: any; currentPrice: number }) => {
  const classes = useStyles();
  const { rangeBoundaries, currentPrice } = props;
  //TODO - Figure out which Subgraphs to query. Currently Uniswap.
  const { data: priceData } = PriceHistory("DAI");
  const cushionHigh = rangeBoundaries.high * (1 - rangeBoundaries.cushion / 1e4);
  const cushionLow = rangeBoundaries.low * (1 + rangeBoundaries.cushion / 1e4);
  const chartData = priceData.map((item: any) => {
    return {
      ...item,
      uv: [rangeBoundaries.high, cushionHigh],
      lv: [rangeBoundaries.low, cushionLow],
    };
  });

  /* We load an object at the front of the chartData array
   * with no price data to shift the chart line left.
   */
  chartData.unshift({
    uv: [rangeBoundaries.high, rangeBoundaries.high * (1 - rangeBoundaries.cushion / 1e4)],
    lv: [rangeBoundaries.low, rangeBoundaries.low * (1 + rangeBoundaries.cushion / 1e4)],
  });

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
    <Paper className={`ohm-card tooltip-container`}>
      <DataRow title="Price" balance={formatCurrency(currentPrice, 2)} />
      <DataRow title="Upper Wall" balance={formatCurrency(rangeBoundaries.high, 2)} />
      <DataRow title="Upper Cushion" balance={formatCurrency(cushionHigh, 2)} />
      <DataRow title="Lower Cushion" balance={formatCurrency(cushionLow, 2)} />
      <DataRow title="Lower Wall" balance={formatCurrency(rangeBoundaries.low, 2)} />
    </Paper>
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <XAxis reversed scale="auto" dataKey="timestamp" />
        <YAxis scale="auto" domain={["dataMin", "dataMax"]} />
        <Tooltip content={<TooltipContent />} />
        <Area
          type="monotone"
          dataKey="uv"
          fill="#ff8585"
          stroke="#ff8585"
          strokeDasharray={"6 3"}
          strokeWidth={2}
          fillOpacity={0.4}
        />
        <Area
          type="linear"
          fill="#94b9a1"
          dataKey="lv"
          stroke="#94b9a1"
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
        <ReferenceDot
          x={chartData.length > 1 && chartData[1].timestamp}
          //TODO: replace w/ bond price if were in the cushion
          y={12.5}
          shape={CustomReferenceDot}
          fill="#F8CC82"
        >
          <Label className={classes.currentPrice} color="#fff" position={"right"}>
            $12.50
          </Label>
        </ReferenceDot>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default RangeChart;
