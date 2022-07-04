import "./chart.scss";

import { t } from "@lingui/macro";
import { Box, CircularProgress, SvgIcon, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { InfoTooltip } from "@olympusdao/component-library";
import { format } from "date-fns";
import { CSSProperties, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { ReactComponent as Fullscreen } from "src/assets/icons/fullscreen.svg";
import { formatCurrency, trim } from "src/helpers";

import CustomTooltip from "./CustomTooltip";
import ExpandedChart from "./ExpandedChart";

const tickCount = 3;
const expandedTickCount = 5;
const xAxisRightPadding = 30;
const xAxisInterval = 10;
const lineChartStrokeWidth = 2;

export enum DataFormat {
  Currency,
  Percentage,
  DateMonth,
  None,
}

const renderExpandedChartStroke = (isExpanded: boolean, color: string) => {
  return isExpanded ? <CartesianGrid vertical={false} stroke={color} /> : "";
};

export const formatCurrencyTick = (value: unknown): string => {
  const valueNum: number = typeof value == "number" ? value : typeof value == "string" ? parseFloat(value) : 0;

  if (!valueNum) return "";

  if (valueNum > 1000000) {
    return `${formatCurrency(valueNum / 1000000)}M`;
  }

  if (valueNum > 1000) {
    return `${formatCurrency(valueNum / 1000)}k`;
  }

  return formatCurrency(valueNum, 2);
};

export const formatPercentTick = (value: unknown): string => {
  const valueNum: number = typeof value == "number" ? value : typeof value == "string" ? parseFloat(value) : 0;

  if (!valueNum) return "";

  return trim(valueNum, 2) + "%";
};

export const formatDateMonthTick = (value: unknown): string => {
  const valueNum: number = typeof value == "number" ? value : typeof value == "string" ? parseFloat(value) : 0;

  if (!valueNum) return "";

  return format(new Date(valueNum * 1000), "MMM dd");
};

const getTickFormatter = (dataFormat: DataFormat, value: unknown): string => {
  if (dataFormat == DataFormat.Currency) return formatCurrencyTick(value);

  if (dataFormat == DataFormat.Percentage) return formatPercentTick(value);

  if (dataFormat == DataFormat.DateMonth) return formatDateMonthTick(value);

  return "";
};

const renderAreaChart = (
  data: any[],
  dataKey: string[],
  stopColor: string[][],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isStaked: boolean,
  isExpanded: boolean,
  expandedGraphStrokeColor: string,
  isPOL: boolean,
  margin: CategoricalChartProps["margin"],
) => (
  <AreaChart data={data} margin={margin}>
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
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      reversed={true}
      padding={{ right: xAxisRightPadding }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={dataFormat == DataFormat.Percentage ? 33 : 55}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, "auto"]}
      dx={3}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
          isStaked={isStaked}
          isPOL={isPOL}
        />
      }
    />
    <Area dataKey={dataKey[0]} stroke="none" fill={`url(#color-${dataKey[0]})`} fillOpacity={1} />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </AreaChart>
);

const renderStackedAreaChart = (
  data: any[],
  dataKey: string[],
  stopColor: string[][],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  expandedGraphStrokeColor: string,
  margin: CategoricalChartProps["margin"],
) => (
  <AreaChart data={data} margin={margin}>
    <defs>
      {dataKey.map((value: string, index: number) => {
        return (
          <linearGradient id={`color-${dataKey[index]}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stopColor[index][0]} stopOpacity={1} />
            <stop offset="90%" stopColor={stopColor[index][1]} stopOpacity={0.9} />
          </linearGradient>
        );
      })}
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={xAxisInterval}
      axisLine={false}
      tickLine={false}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      reversed={true}
      padding={{ right: xAxisRightPadding }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={dataFormat == DataFormat.Percentage ? 33 : 55}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, "auto"]}
      allowDataOverflow={false}
    />
    <Tooltip
      formatter={(value: string) => trim(parseFloat(value), 2)}
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Area
      dataKey={dataKey[0]}
      stroke={stroke ? stroke[0] : "none"}
      fill={stroke ? stroke[0] : "none"}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[1]}
      stroke={stroke ? stroke[1] : "none"}
      fill={stroke ? stroke[1] : "none"}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[2]}
      stroke={stroke ? stroke[2] : "none"}
      fill={stroke ? stroke[2] : "none"}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[3]}
      stroke={stroke ? stroke[3] : "none"}
      fill={stroke ? stroke[3] : "none"}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[4]}
      stroke={stroke ? stroke[4] : "none"}
      fill={stroke ? stroke[4] : "none"}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[5]}
      stroke={stroke ? stroke[5] : "none"}
      fill={stroke ? stroke[5] : "none"}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[6]}
      stroke={stroke ? stroke[6] : "none"}
      fill={stroke ? stroke[6] : "none"}
      fillOpacity={1}
      stackId="1"
    />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </AreaChart>
);

const renderLineChart = (
  data: any[],
  dataKey: string[],
  stroke: string[],
  color: string,
  dataFormat: DataFormat,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  expandedGraphStrokeColor: string,
  margin: CategoricalChartProps["margin"],
  scale?: string,
) => (
  <LineChart data={data} margin={margin}>
    <XAxis
      dataKey="timestamp"
      interval={100}
      axisLine={false}
      tickCount={3}
      tickLine={false}
      reversed={true}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      padding={{ right: xAxisRightPadding }}
    />
    <YAxis
      tickCount={scale == "log" ? 1 : isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={32}
      scale={() => scale}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[scale == "log" ? "dataMin" : 0, "auto"]}
      allowDataOverflow={false}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Line type="monotone" dataKey={dataKey[0]} stroke={stroke ? stroke[0] : "none"} color={color} dot={false} />;
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </LineChart>
);

const renderMultiLineChart = (
  data: any[],
  dataKey: string[],
  stroke: string[],
  color: string,
  dataFormat: DataFormat,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  expandedGraphStrokeColor: string,
  margin: CategoricalChartProps["margin"],
  itemDecimals?: number,
) => (
  <LineChart data={data} margin={margin}>
    <XAxis
      dataKey="timestamp"
      interval={xAxisInterval}
      axisLine={false}
      tickCount={3}
      tickLine={false}
      reversed={true}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      padding={{ right: xAxisRightPadding }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={25}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, "auto"]}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
          itemDecimals={itemDecimals}
        />
      }
    />
    <Line dataKey={dataKey[0]} stroke={stroke[0]} dot={false} strokeWidth={lineChartStrokeWidth} />;
    <Line dataKey={dataKey[1]} stroke={stroke[1]} dot={false} strokeWidth={lineChartStrokeWidth} />;
    <Line dataKey={dataKey[2]} stroke={stroke[2]} dot={false} strokeWidth={lineChartStrokeWidth} />;
    <Line dataKey={dataKey[3]} stroke={stroke[3]} dot={false} strokeWidth={lineChartStrokeWidth} />;
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </LineChart>
);

// JTBD: Bar chart for Holders
const renderBarChart = (
  data: any[],
  dataKey: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  expandedGraphStrokeColor: string,
  margin: CategoricalChartProps["margin"],
) => (
  <BarChart data={data} margin={margin}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={tickCount}
      tickLine={false}
      reversed={true}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      padding={{ right: xAxisRightPadding }}
    />
    <YAxis
      axisLine={false}
      tickLine={false}
      tickCount={isExpanded ? expandedTickCount : tickCount}
      width={33}
      domain={[0, "auto"]}
      allowDataOverflow={false}
      tickFormatter={number => (number !== 0 ? number : "")}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Bar dataKey={dataKey[0]} fill={stroke[0]} />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </BarChart>
);

function Chart({
  type,
  data,
  scale,
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
  infoTooltipMessage,
  expandedGraphStrokeColor,
  isPOL,
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  itemDecimals,
}: {
  type: string;
  data: any[];
  scale?: string;
  dataKey: string[];
  color: string;
  stopColor: string[][];
  stroke: string[];
  headerText: string;
  dataFormat: DataFormat;
  headerSubText: string;
  bulletpointColors: CSSProperties[];
  itemNames: string[];
  itemType: string;
  isStaked: boolean;
  infoTooltipMessage: string;
  expandedGraphStrokeColor: string;
  isPOL: boolean;
  margin?: CategoricalChartProps["margin"];
  itemDecimals?: number;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderChart = (type: string, isExpanded: boolean) => {
    if (type === "line")
      return renderLineChart(
        data,
        dataKey,
        stroke,
        color,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        margin,
        scale,
      );
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
        isExpanded,
        expandedGraphStrokeColor,
        isPOL,
        margin,
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
        isExpanded,
        expandedGraphStrokeColor,
        margin,
      );
    if (type === "multi")
      return renderMultiLineChart(
        data,
        dataKey,
        stroke,
        color,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        margin,
        itemDecimals,
      );

    if (type === "bar")
      return renderBarChart(
        data,
        dataKey,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        margin,
      );
    return <></>;
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return loading ? (
    <Box style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box style={{ width: "100%", height: "100%" }}>
      <div className="chart-card-header">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          style={{ width: "100%", overflow: "hidden" }}
        >
          <Box display="flex" width="90%" alignItems="center">
            <Typography
              variant="h6"
              color="textSecondary"
              className="card-title-text"
              style={{ fontWeight: 400, overflow: "hidden" }}
            >
              {headerText}
            </Typography>
            <Typography variant={"h6"} color="textSecondary">
              <InfoTooltip message={infoTooltipMessage} />
            </Typography>
          </Box>
          {/* could make this svgbutton */}

          <SvgIcon
            component={Fullscreen}
            color="primary"
            onClick={handleOpen}
            style={{ fontSize: "1rem", cursor: "pointer" }}
          />
          <ExpandedChart
            open={open}
            handleClose={handleClose}
            renderChart={renderChart(type, true)}
            data={data}
            infoTooltipMessage={infoTooltipMessage}
            headerText={headerText}
            headerSubText={headerSubText}
          />
        </Box>
        {loading ? (
          <Skeleton variant="text" width={100} />
        ) : (
          <Box display="flex">
            <Typography variant="h4" style={{ fontWeight: 600, marginRight: 5 }}>
              {headerSubText}
            </Typography>
            <Typography variant="h4" color="textSecondary" style={{ fontWeight: 400 }}>
              {type !== "multi" && t`Today`}
            </Typography>
          </Box>
        )}
      </div>
      <Box width="100%" minHeight={260} minWidth={310} className="ohm-chart">
        {loading || (data && data.length > 0) ? (
          <ResponsiveContainer minHeight={260} width="100%">
            {renderChart(type, false)}
          </ResponsiveContainer>
        ) : (
          <Skeleton variant="rectangular" width="100%" height={260} />
        )}
      </Box>
    </Box>
  );
}

export default Chart;
