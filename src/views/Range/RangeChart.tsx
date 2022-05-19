import { styled } from "@mui/material/styles";
import { DataRow, Paper } from "@olympusdao/component-library";
import { Area, ComposedChart, Label, Line, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "src/helpers";

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
const RangeChart = (props: { rangeData: any; currentPrice: number }) => {
  const { rangeData, currentPrice } = props;
  //TODO - Figure out which Subgraphs to query. Currently Uniswap.
  const { data: priceData } = PriceHistory("DAI");

  const chartData = priceData.map((item: any) => {
    return {
      ...item,
      uv: [rangeData.wall.high.price, rangeData.cushion.high.price],
      lv: [rangeData.wall.low.price, rangeData.cushion.low.price],
    };
  });

  /* We load an object at the front of the chartData array
   * with no price data to shift the chart line left.
   */
  chartData.unshift({
    uv: [rangeData.wall.high.price, rangeData.cushion.high.price],
    lv: [rangeData.wall.low.price, rangeData.cushion.low.price],
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
      <DataRow title="Upper Wall" balance={formatCurrency(rangeData.wall.high.price, 2)} />
      <DataRow title="Upper Cushion" balance={formatCurrency(rangeData.cushion.high.price, 2)} />
      <DataRow title="Lower Cushion" balance={formatCurrency(rangeData.cushion.low.price, 2)} />
      <DataRow title="Lower Wall" balance={formatCurrency(rangeData.wall.low.price, 2)} />
    </Paper>
  );

  return (
    <StyledResponsiveContainer width="100%" height={400}>
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
    </StyledResponsiveContainer>
  );
};

export default RangeChart;
