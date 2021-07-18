import { ResponsiveContainer, AreaChart, LineChart, Line, XAxis, YAxis, Area, Tooltip } from "recharts";
import { Typography, Box } from "@material-ui/core";
import { trim } from "../../helpers";
import _ from "lodash";
import "./chart.scss";

function Chart({ type, data, dataKey, dataFormat, color, stopColor, stroke, headerText }) {
  const renderLineChart = () => (
    <LineChart data={data}>
      {dataKey.map(key => {
        let i = _.indexOf(dataKey, key);
        let lineStroke = stroke[i] ? stroke[i] : "#333";
        return (
          <Line
            type="monotone"
            key={`${dataKey}`}
            dataKey={dataKey[0]}
            stroke={stroke[lineStroke]}
            color={color}
            dot={false}
          />
        );
      })}
      <XAxis
        dataKey="timestamp"
        interval={30}
        axisLine={false}
        tickCount={3}
        tickLine={false}
        reversed={true}
        connectNulls={true}
        domain={["dataMin", "dataMax"]}
      />
      <YAxis
        interval={dataMax => dataMax * 0.33}
        tickCount={3}
        axisLine={false}
        tickLine={false}
        tickFormatter={number => `${trim(parseFloat(number), 2)}`}
        domain={[0, dataMax => parseFloat(dataMax) * 1.3]}
        connectNulls={true}
        type="number"
        allowDataOverflow={false}
      />
      <Tooltip />
    </LineChart>
  );

  const renderAreaChart = () => (
    <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} align="bottom">
      <defs>
        <linearGradient id={`color-${dataKey[0]}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stopColor[0]} stopOpacity={1} />
          <stop offset="90%" stopColor={stopColor[1]} stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <XAxis
        dataKey="timestamp"
        interval={30}
        axisLine={false}
        tickCount={3}
        tickLine={false}
        reversed={true}
        connectNulls={true}
        domain={["dataMin", "dataMax"]}
      />
      <YAxis
        interval={dataMax => dataMax * 0.33}
        tickCount={3}
        axisLine={false}
        tickLine={false}
        tickFormatter={number => `${trim(parseFloat(number), 2)}`}
        domain={[0, dataMax => parseFloat(dataMax) * 2.53]}
        connectNulls={true}
        type="number"
        allowDataOverflow={false}
      />
      <Tooltip />
      <Area dataKey={dataKey[0]} stroke={stroke[0]} fill={`url(#color-${dataKey})`} fillOpacity={1} />
    </AreaChart>
  );

  // JTBD: Bar chart for Holders
  const renderBarChart = () => {};

  const chartIndex = {
    line: renderLineChart(),
    area: renderAreaChart(),
  };

  return (
    <Box style={{ width: "100%", minWidth: "330px" }}>
      <div className="card-header">
        <Typography variant="h6" color="textSecondary">
          {headerText}
        </Typography>
        <Box display="flex">
          <Typography variant="h4" style={{ fontWeight: 600 }}>
            {data &&
              (dataFormat === "currency"
                ? dataKey &&
                  dataKey.map(key =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(data[0][key]),
                  )
                : dataKey && dataKey.map(key => `${trim(data[0][key], 1)}% `))}
          </Typography>

          <Typography variant="h4" color="textSecondary" style={{ marginLeft: "3px" }}>
            Today
          </Typography>
        </Box>
      </div>
      <Box className="ohm-chart" style={{ width: "100%", height: "250px" }}>
        <ResponsiveContainer width="99%" minWidth="0" height="99%" aspect={3}>
          {chartIndex[type]}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default Chart;
