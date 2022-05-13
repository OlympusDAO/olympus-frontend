import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Area, ComposedChart, Line, ReferenceDot, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { PriceHistory, RangeBoundaries } from "./hooks";

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    "& .svg-area": {
      display: "block",
      margin: "0 auto 1rem",
      background: " #efefef",
    },
    "& #core": {
      fill: "#F8CC82",
      animation: "$pulse1 1.5s ease-in-out infinite",
    },
    "& #radar": {
      fill: "rgba(248, 204, 130, 0.5)",
      animation: "$pulse2 1.5s ease-in-out infinite",
    },
  },
  "@keyframes pulse1": {
    "0%": {
      opacity: 0,
      transform: "scale(0)",
    },
    "30%": {
      opacity: 1,
      transform: "scale(1.5)",
    },
    "60%": {
      opacity: 1,
      transform: "scale(2)",
    },

    "100%": {
      opacity: 0,
      transform: "scale(2)",
    },
  },

  "@keyframes pulse2": {
    "0%": {
      transform: "scale(1, 1)",
      opacity: 0,
    },

    "50%": {
      opacity: 1,
    },
    "100%": {
      transform: "scale(6, 6)",
      opacity: 0,
    },
  },
}));

//export interface OHMRangeChartProps {}

/**
 * Component for Displaying RangeChart
 */
const RangeChart = () => {
  //TODO - Figure out which Subgraphs to query. Currently Uniswap.
  const { data: priceData } = PriceHistory("DAI");
  const classes = useStyles();
  const { data: rangeBoundaries } = RangeBoundaries("CONTRACT_ADDRESS");

  const chartData = priceData.map((item: any) => {
    return {
      ...item,
      uv: [rangeBoundaries.high, rangeBoundaries.high * (1 - rangeBoundaries.cushion / 1e4)],
      lv: [rangeBoundaries.low, rangeBoundaries.low * (1 + rangeBoundaries.cushion / 1e4)],
    };
  });

  chartData.unshift({
    uv: [rangeBoundaries.high, rangeBoundaries.high * (1 - rangeBoundaries.cushion / 1e4)],
    lv: [rangeBoundaries.low, rangeBoundaries.low * (1 + rangeBoundaries.cushion / 1e4)],
  });

  const CustomReferenceDot = (props: { cx: string | number | undefined; cy: string | number | undefined }) => {
    return (
      <>
        <circle cx={props.cx} cy={props.cy} fill="#F8CC82" r="8"></circle>
        <circle cx={props.cx} cy={props.cy} fill="#F8CC82" r="8">
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

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <XAxis reversed scale="auto" dataKey="timestamp" />
        <YAxis scale="auto" domain={["dataMin", "dataMax"]} />
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
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default RangeChart;
