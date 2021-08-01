import CustomTooltip from "../Tooltip/CustomTooltip";
import { ResponsiveContainer, BarChart, Bar, AreaChart, LineChart, Line, XAxis, YAxis, Area, Tooltip } from "recharts";
import { Typography, Box } from "@material-ui/core";
import { trim } from "../../helpers";
import _ from "lodash";
import { format } from "date-fns";
import "./chart.scss";
import { useEffect } from "react";

const formatCurrency = c => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c);
};

const renderAreaChart = (
  data,
  dataKey,
  stopColor,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked,
) => (
  <AreaChart data={data}>
    <defs>
      <linearGradient id={`color-${dataKey[0]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[0][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[0][1]} stopOpacity={0.9} />
      </linearGradient>
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickLine={false}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      reversed={true}
      connectNulls={true}
      padding={{ right: 10 }}
    />
    <YAxis
      tickCount={3}
      axisLine={false}
      tickLine={false}
      tickFormatter={number =>
        number !== 0
          ? dataFormat !== "percent"
            ? `${formatCurrency(parseFloat(number) / 1000000)}M`
            : `${trim(parseFloat(number), 2)}%`
          : ""
      }
      domain={[0, "auto"]}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
          isStaked={isStaked}
        />
      }
    />
    <Area dataKey={dataKey[0]} stroke={stroke[0]} fill={`url(#color-${dataKey[0]})`} fillOpacity={1} />
  </AreaChart>
);

const renderStackedAreaChart = (
  data,
  dataKey,
  stopColor,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
) => (
  <AreaChart data={data}>
    <defs>
      <linearGradient id={`color-${dataKey[0]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[0][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[0][1]} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`color-${dataKey[1]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[1][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[1][1]} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`color-${dataKey[2]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[2][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[2][1]} stopOpacity={0.9} />
      </linearGradient>
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickLine={false}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      reversed={true}
      connectNulls={true}
      padding={{ right: 10 }}
    />
    <YAxis
      tickCount={3}
      axisLine={false}
      tickLine={false}
      tickFormatter={number => {
        if (number !== 0) {
          if (dataFormat === "percent") {
            return `${trim(parseFloat(number), 2)}%`;
          } else if (dataFormat === "k") return `${formatCurrency(parseFloat(number) / 1000)}k`;
          else return `${formatCurrency(parseFloat(number) / 1000000)}M`;
        }
        return "";
      }}
      domain={[0, "auto"]}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      formatter={value => trim(parseFloat(value), 2)}
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Area dataKey={dataKey[0]} stroke={stroke[0]} fill={`url(#color-${dataKey[0]})`} fillOpacity={1} />
    <Area dataKey={dataKey[1]} stroke={stroke[1]} fill={`url(#color-${dataKey[1]})`} fillOpacity={1} />
    <Area dataKey={dataKey[2]} stroke={stroke[2]} fill={`url(#color-${dataKey[2]})`} fillOpacity={1} />
  </AreaChart>
);

const renderLineChart = (data, dataKey, stroke, color, dataFormat, bulletpointColors, itemNames, itemType) => (
  <LineChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={3}
      tickLine={false}
      reversed={true}
      connectNulls={true}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      padding={{ right: 10 }}
    />
    <YAxis
      tickCount={3}
      axisLine={false}
      tickLine={false}
      tickFormatter={number =>
        number !== 0
          ? dataFormat !== "percent"
            ? `${formatCurrency(parseFloat(number) / 1000000)}M`
            : `${trim(parseFloat(number), 2)}%`
          : ""
      }
      domain={[0, "auto"]}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Line type="monotone" dataKey={dataKey[0]} stroke="#49A1F2" color={color} dot={false} />;
  </LineChart>
);

const renderMultiLineChart = (data, dataKey, stroke, color, dataFormat, bulletpointColors, itemNames, itemType) => (
  <LineChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={3}
      tickLine={false}
      reversed={true}
      connectNulls={true}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      padding={{ right: 10 }}
    />
    <YAxis
      tickCount={3}
      axisLine={false}
      tickLine={false}
      tickFormatter={number => (number !== 0 ? `${trim(parseFloat(number), 2)}` : "")}
      domain={[0, "auto"]}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Line type="monotone" dataKey={dataKey[0]} stroke="#FFFFFF" dot={false} />;
    <Line type="monotone" dataKey={dataKey[1]} stroke="#2EC608" dot={false} />;
    <Line type="monotone" dataKey={dataKey[2]} stroke="#49A1F2" dot={false} />;
  </LineChart>
);

// JTBD: Bar chart for Holders
const renderBarChart = (data, dataKey, stroke, dataFormat, bulletpointColors, itemNames, itemType) => (
  <BarChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={3}
      tickLine={false}
      reversed={true}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      padding={{ right: 10 }}
    />
    <YAxis axisLine={false} tickLine={false} tickCount={3} />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Bar dataKey={dataKey[0]} fill={stroke[0]} />
  </BarChart>
);

function Chart({
  type,
  data,
  dataKey,
  color,
  stopColor,
  stroke,
  headerText,
  dataFormat,
  headerSubText,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked,
}) {
  const renderChart = type => {
    if (type === "line")
      return renderLineChart(data, dataKey, color, stroke, dataFormat, bulletpointColors, itemNames, itemType);
    if (type === "area")
      return renderAreaChart(
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isStaked,
      );
    if (type === "stack")
      return renderStackedAreaChart(
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
      );
    if (type === "multi")
      return renderMultiLineChart(data, dataKey, color, stroke, dataFormat, bulletpointColors, itemNames, itemType);
    if (type === "bar")
      return renderBarChart(data, dataKey, stroke, dataFormat, bulletpointColors, itemNames, itemType);
  };

  useEffect(() => {
    console.log("data loaded", data);
  }, [data]);

  return (
    <Box style={{ width: "100%", height: "100%" }}>
      <div className="card-header">
        <Typography variant="h6" color="textSecondary">
          {headerText}
        </Typography>
        <Box display="flex">
          <Typography variant="h4" style={{ fontWeight: 600 }}>
            {headerSubText}
          </Typography>
        </Box>
      </div>
      <Box minWidth={300} style={{ margin: "0 0 -10px -25px" }}>
        {data && data.length > 0 && (
          <ResponsiveContainer width="99%" minWidth="280px" height="99%" minHeight="250px">
            {renderChart(type)}
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
}

export default Chart;
