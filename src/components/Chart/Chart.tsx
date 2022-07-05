import "./chart.scss";

import { t } from "@lingui/macro";
import { Box, CircularProgress, Grid, Link, SvgIcon, Tooltip as MuiTooltip, Typography } from "@mui/material";
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
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { ReactComponent as Fullscreen } from "src/assets/icons/fullscreen.svg";
import { ReactComponent as GraphLogo } from "src/assets/icons/graph-grt-logo.svg";
import { formatCurrency, trim } from "src/helpers";

import CustomTooltip from "./CustomTooltip";
import ExpandedChart from "./ExpandedChart";
import { getDataIntersections, getDataWithRange, getIntersectionColor } from "./IntersectionHelper";

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

const getValidCSSSelector = (value: string): string => {
  return value.replaceAll(" ", "-");
};

const renderStackedAreaChart = (
  data: any[],
  dataKey: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
) => (
  <AreaChart data={data} margin={margin}>
    <defs>
      {dataKey.map((value: string, index: number) => {
        return (
          <linearGradient id={`color-${getValidCSSSelector(value)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke[index]} stopOpacity={1} />
            <stop offset="100%" stopColor={stroke[index]} stopOpacity={0.2} />
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
      axisLine={false}
      width={dataFormat == DataFormat.Percentage ? 33 : 55}
      tickCount={isExpanded ? expandedTickCount : tickCount}
      tickLine={false}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, "auto"]}
      allowDataOverflow={false}
    />
    <Tooltip
      formatter={(value: string) => trim(parseFloat(value), 2)}
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    {dataKey.map((value: string, index: number) => {
      return (
        <Area
          dataKey={value}
          stroke={stroke ? stroke[index] : "none"}
          fill={`url(#color-${getValidCSSSelector(value)})`}
          fillOpacity={1}
          stackId="1"
        />
      );
    })}
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

const renderComposedChart = (
  data: any[],
  dataKey: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  itemDecimals?: number,
) => {
  // Intersections code from: https://codesandbox.io/s/qdlyi?file=/src/tests/ComparisonChart.js
  /**
   * We add the "range" key to the incoming data.
   * This contains the lower and higher values for the contents of {dataKey}.
   */
  const dataWithRange = getDataWithRange(data, dataKey);
  /**
   * This obtains the points where any line intersects with the other,
   * which is used to fill an Area element.
   *
   * The data we receive from the subgraph is in reverse-chronological order.
   * The intersections code relies on the data being in chronological order,
   * so we need to reverse the order of the array without mutating the original
   * one.
   */
  const intersections = getDataIntersections(data.slice().reverse(), dataKey);

  return (
    <ComposedChart data={dataWithRange} margin={margin}>
      <defs>
        <linearGradient id="range">
          {intersections.length ? (
            intersections.map((intersection, index) => {
              const nextIntersection = intersections[index + 1];

              const isLast = index === intersections.length - 1;
              const closeColor = getIntersectionColor(intersection, false);
              const startColor = isLast
                ? getIntersectionColor(intersection, true)
                : getIntersectionColor(nextIntersection, false);

              // Determine the offset from the start of the x-axis
              const offset =
                intersection.x /
                (data.filter(value => value[dataKey[0]] !== undefined && value[dataKey[1]] != undefined).length - 1);

              return (
                <>
                  <stop offset={offset} stopColor={closeColor} stopOpacity={0.3} />
                  <stop offset={offset} stopColor={startColor} stopOpacity={0.3} />
                </>
              );
            })
          ) : (
            <></>
          )}
        </linearGradient>
      </defs>
      <XAxis
        dataKey="timestamp"
        interval={xAxisInterval}
        axisLine={false}
        reversed={true}
        tickCount={tickCount}
        tickLine={false}
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
      <Area dataKey="range" stroke={stroke[0]} fill={`url(#range)`} />
      {dataKey.map((value: string, index: number) => {
        return <Line dataKey={value} stroke={stroke[index]} dot={false} strokeWidth={lineChartStrokeWidth} />;
      })}
    </ComposedChart>
  );
};

const renderMultiLineChart = (
  data: any[],
  dataKey: string[],
  stroke: string[],
  dataFormat: DataFormat,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  itemDecimals?: number,
) => (
  <LineChart data={data} margin={margin}>
    <XAxis
      dataKey="timestamp"
      interval={xAxisInterval}
      axisLine={false}
      reversed={true}
      tickCount={tickCount}
      tickLine={false}
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
    {dataKey.map((value: string, index: number) => {
      return <Line dataKey={value} stroke={stroke[index]} dot={false} strokeWidth={lineChartStrokeWidth} />;
    })}
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
  subgraphQueryUrl,
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
  subgraphQueryUrl?: string;
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
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        margin,
      );
    if (type === "multi")
      return renderMultiLineChart(
        data,
        dataKey,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        margin,
        itemDecimals,
      );
    if (type === "composed")
      return renderComposedChart(
        data,
        dataKey,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
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

          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                {subgraphQueryUrl && (
                  <Link href={subgraphQueryUrl} target="_blank" rel="noopener noreferrer">
                    <MuiTooltip title={t`Open Subgraph Query`}>
                      <SvgIcon component={GraphLogo} viewBox="0 0 100 100" style={{ width: "16px", height: "16px" }} />
                    </MuiTooltip>
                  </Link>
                )}
              </Grid>
              <Grid item>
                <MuiTooltip title={t`Open in expanded view`}>
                  <SvgIcon
                    component={Fullscreen}
                    color="primary"
                    onClick={handleOpen}
                    style={{ fontSize: "1rem", cursor: "pointer" }}
                  />
                </MuiTooltip>
              </Grid>
            </Grid>
          </Grid>
          <ExpandedChart
            open={open}
            handleClose={handleClose}
            renderChart={renderChart(type, true)}
            data={data}
            infoTooltipMessage={infoTooltipMessage}
            headerText={headerText}
            headerSubText={headerSubText}
            subgraphQueryUrl={subgraphQueryUrl}
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
