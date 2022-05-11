import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { OHMPriceHistory, RangeBoundaries } from "./hooks";

const useStyles = makeStyles<Theme>(theme => ({}));

//export interface OHMRangeChartProps {}

/**
 * Component for Displaying RangeChart
 */
const RangeChart = () => {
  //TODO - Figure out which Subgraphs to query. Currently Uniswap.
  const { data: priceData } = OHMPriceHistory("0x0ab87046fbb341d058f17cbc4c1133f25a20a52f");
  const classes = useStyles();
  const { data: rangeBoundaries } = RangeBoundaries("CONTRACT_ADDRESS");

  const chartData = priceData.map((item: any) => {
    return {
      ...item,
      uv: [rangeBoundaries.high, rangeBoundaries.high * (1 - rangeBoundaries.cushion / 1e4)],
      lv: [rangeBoundaries.low, rangeBoundaries.low * (1 + rangeBoundaries.cushion / 1e4)],
    };
  });

  console.log(priceData, chartData);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <defs>
          <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
            <path
              d="M-1,1 l2,-2
       M0,4 l4,-4
       M3,5 l2,-2"
              stroke="#ff8585"
              strokeWidth="1"
            />
          </pattern>
          <pattern id="diagonalHatchLow" patternUnits="userSpaceOnUse" width="4" height="4">
            <path
              d="M-1,1 l2,-2
       M0,4 l4,-4
       M3,5 l2,-2"
              stroke="#94b9a1"
              strokeWidth=""
            />
          </pattern>
        </defs>
        <XAxis reversed scale="auto" dataKey="date" />
        <YAxis scale="auto" domain={["dataMin", "dataMax"]} />
        <Tooltip />
        <Line type="monotone" dataKey="priceUSD" stroke="#fafafa" dot={false} />
        <Area type="monotone" dataKey="uv" fill="url(#diagonalHatch)" stroke="#ff8585" />
        <Area type="linear" fill="url(#diagonalHatchLow)" dataKey="lv" stroke="#94b9a1" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default RangeChart;
