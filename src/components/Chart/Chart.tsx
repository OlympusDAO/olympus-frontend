import { format } from "date-fns";
import { CSSProperties, useState } from "react";
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
import { formatCurrency, trim } from "src/helpers";
import { ChartCard } from "src/views/TreasuryDashboard/components/Graph/ChartCard";

import CustomTooltip from "./CustomTooltip";
import ExpandedChart from "./ExpandedChart";
import { getDataIntersections, getDataWithRange, getIntersectionColor, RANGE_KEY } from "./IntersectionHelper";

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
  displayTooltipTotal?: boolean,
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
          dataKey={dataKey}
          displayTotal={displayTooltipTotal}
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
  displayTooltipTotal?: boolean,
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
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
          dataKey={dataKey}
          displayTotal={displayTooltipTotal}
        />
      }
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
  displayTooltipTotal?: boolean,
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
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
          dataKey={dataKey}
          displayTotal={displayTooltipTotal}
        />
      }
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
  displayTooltipTotal?: boolean,
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
        <linearGradient id={RANGE_KEY}>
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
            dataKey={dataKey}
            displayTotal={displayTooltipTotal}
          />
        }
      />
      <Area dataKey={RANGE_KEY} stroke={stroke[0]} fill={`url(#range)`} />
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
  displayTooltipTotal?: boolean,
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
          dataKey={dataKey}
          displayTotal={displayTooltipTotal}
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
  displayTooltipTotal?: boolean,
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
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
          dataKey={dataKey}
          displayTotal={displayTooltipTotal}
        />
      }
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
  isLoading,
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  itemDecimals,
  subgraphQueryUrl,
  displayTooltipTotal,
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
  isLoading: boolean;
  margin?: CategoricalChartProps["margin"];
  itemDecimals?: number;
  subgraphQueryUrl?: string;
  displayTooltipTotal?: boolean;
}) {
  const [open, setOpen] = useState(false);

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
        displayTooltipTotal,
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
        displayTooltipTotal,
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
        displayTooltipTotal,
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
        displayTooltipTotal,
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
        displayTooltipTotal,
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
        displayTooltipTotal,
      );
    return <></>;
  };

  const expandedChart = (
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
  );

  // TODO consider turning chart into a component placed within ChartCard
  /**
   * Setting the width to 99% ensures that the chart resizes correctly.
   *
   * Source: https://stackoverflow.com/a/53205850
   */
  return (
    <ChartCard
      headerText={headerText}
      headerTooltip={infoTooltipMessage}
      headerSubtext={headerSubText}
      subgraphQueryUrl={subgraphQueryUrl}
      expandedChart={expandedChart}
      handleOpenExpandedChart={handleOpen}
      isLoading={isLoading}
    >
      <ResponsiveContainer minHeight={260} width="99%">
        {renderChart(type, false)}
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default Chart;
