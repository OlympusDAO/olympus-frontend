import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { OHMPriceHistory } from "./hooks";

const useStyles = makeStyles<Theme>(theme => ({}));

//export interface OHMRangeChartProps {}

/**
 * Component for Displaying RangeChart
 */
const RangeChart = () => {
  //TODO - Figure out which Subgraphs to query. Currently Uniswap.
  const { data } = OHMPriceHistory("0x0ab87046fbb341d058f17cbc4c1133f25a20a52f");
  const classes = useStyles();

  const test = data.map((item: any) => {
    return { ...item, uv: [2800, 2600], lv: [1500, 1800] };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={test}>
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
        <XAxis reversed dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="priceUSD" stroke="#fafafa" dot={false} />
        <Area type="monotone" dataKey="uv" fill="url(#diagonalHatch)" stroke="#ff8585" />
        <Area type="linear" fill="url(#diagonalHatchLow)" dataKey="lv" stroke="#94b9a1" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default RangeChart;
