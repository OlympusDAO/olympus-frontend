import { format, utcToZonedTime } from "date-fns-tz";
import { CSSProperties, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CategoricalChartFunc, CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import CustomTooltip from "src/components/Chart/CustomTooltip";
import ExpandedChart from "src/components/Chart/ExpandedChart";
import {
  getAreaColor,
  getDataIntersections,
  getDataWithRange,
  getIntersectionColor,
  RANGE_KEY,
} from "src/components/Chart/IntersectionHelper";
import { formatCurrency, formatNumber, trim } from "src/helpers";
import { getFloat } from "src/helpers/NumberHelper";
import { getMaximumValue, objectHasProperty } from "src/helpers/subgraph/ProtocolMetricsHelper";
import { ChartCard, DEFAULT_HEIGHT } from "src/views/TreasuryDashboard/components/Graph/ChartCard";

const TICK_COUNT = 5;
const TICK_COUNT_EXPANDED = 5;
const XAXIS_PADDING_RIGHT = 30;
const XAXIS_TICK_INTERVAL = "preserveStart"; // Ensures that the last x-axis tick (current day) is displayed
const XAXIS_TICK_GAP = 20; // Ensures that x-axis ticks on mobile are dropped
const LINE_STROKE_WIDTH = 3;

export const formatCurrencyTick = (value: unknown): string => {
  const valueNum: number = getFloat(value);

  if (!valueNum) return "";

  if (valueNum > 1000000) {
    return `${formatCurrency(valueNum / 1000000)}M`;
  }

  if (valueNum > 1000) {
    return `${formatCurrency(valueNum / 1000)}k`;
  }

  return formatCurrency(valueNum, 2);
};

export const formatNumberTick = (value: unknown): string => {
  const valueNum: number = getFloat(value);

  if (!valueNum) return "";

  if (valueNum > 1000000) {
    return `${formatNumber(valueNum / 1000000)}M`;
  }

  if (valueNum > 1000) {
    return `${formatNumber(valueNum / 1000)}k`;
  }

  return formatNumber(valueNum, 2);
};

export const formatPercentTick = (value: unknown): string => {
  const valueNum: number = getFloat(value);

  if (!valueNum) return "";

  return trim(valueNum, 2) + "%";
};

export const formatDateMonthTick = (value: unknown): string => {
  const valueNum: number = getFloat(value);

  if (!valueNum) return "";

  const date = new Date(valueNum);

  // A little convoluted in order to get this into UTC: https://www.npmjs.com/package/date-fns-tz#low-level-formatting-helpers
  return format(utcToZonedTime(date, "UTC"), "MMM dd", { timeZone: "UTC" });
};

const getTickFormatter = (dataFormat: DataFormat, value: unknown): string => {
  if (dataFormat == DataFormat.Currency) return formatCurrencyTick(value);

  if (dataFormat == DataFormat.Percentage) return formatPercentTick(value);

  if (dataFormat == DataFormat.DateMonth) return formatDateMonthTick(value);

  if (dataFormat == DataFormat.Number) return formatNumberTick(value);

  return "";
};

const renderAreaChart = (
  data: Record<string, unknown>[],
  dataKeys: string[],
  dataKeyColors: Map<string, string>,
  dataFormat: DataFormat,
  dataKeyBulletpointStyles: Map<string, CSSProperties>,
  dataKeyLabels: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => {
  const dataKey = dataKeys[0];
  const dataKeyColor = dataKeyColors.get(dataKey);

  return (
    <AreaChart data={data} margin={margin} onMouseMove={onMouseMove}>
      <defs>
        <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dataKeyColor} stopOpacity={1} />
          <stop offset="90%" stopColor={dataKeyColor} stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <XAxis
        dataKey="timestamp"
        axisLine={false}
        reversed={true}
        padding={{ right: XAXIS_PADDING_RIGHT }}
        // Ticks
        tick={tickStyle}
        interval={XAXIS_TICK_INTERVAL}
        minTickGap={XAXIS_TICK_GAP}
        tickLine={false}
        tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      />
      <YAxis
        tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
        axisLine={false}
        tickLine={false}
        tick={tickStyle}
        width={dataFormat == DataFormat.Percentage ? 33 : 55}
        tickFormatter={number => getTickFormatter(dataFormat, number)}
        domain={[0, maximumYValue]}
        dx={3}
        allowDataOverflow={false}
      />
      <Tooltip
        content={
          <CustomTooltip
            dataKeyBulletpointStyles={dataKeyBulletpointStyles}
            dataKeyLabels={dataKeyLabels}
            dataFormat={dataFormat}
            dataKeys={dataKeys}
            displayTotal={displayTooltipTotal}
          />
        }
      />
      <Area dataKey={dataKey} stroke="none" fill={`url(#color-${dataKey})`} fillOpacity={1} />
    </AreaChart>
  );
};

/**
 * Converts a given string (usually a data key) into a valid CSS selector.
 *
 * Failing to do this would result in the defined CSS style not matching against the
 * data key.
 *
 * Invalid characters are: (space), (, )
 *
 * OlympusDAO/olympus-frontend#2133:
 * We differentiate between the CSS styling for the expanded and standard charts,
 * as closing the expanded chart modal in iOS Safari results in the standard
 * chart being rendered in black. Most likely the CSS styles are unloaded and
 * not restored by the standard chart component.
 */
const getValidCSSSelector = (value: string, isExpanded: boolean): string => {
  return `color${isExpanded ? "-expanded" : ""}-${value.replaceAll(" ", "-").replaceAll("(", "").replaceAll(")", "")}`;
};

const renderStackedAreaChart = (
  data: Record<string, unknown>[],
  dataKeys: string[],
  dataKeyColors: Map<string, string>,
  dataFormat: DataFormat,
  dataKeyBulletpointStyles: Map<string, CSSProperties>,
  dataKeyLabels: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => (
  <AreaChart data={data} margin={margin} onMouseMove={onMouseMove}>
    <defs>
      {dataKeys.map((value: string) => {
        return (
          <linearGradient key={value} id={getValidCSSSelector(value, isExpanded)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={dataKeyColors.get(value)} stopOpacity={1} />
            <stop offset="100%" stopColor={dataKeyColors.get(value)} stopOpacity={0.5} />
          </linearGradient>
        );
      })}
    </defs>
    <XAxis
      dataKey="timestamp"
      axisLine={false}
      reversed={true}
      padding={{ right: XAXIS_PADDING_RIGHT }}
      // Ticks
      tick={tickStyle}
      interval={XAXIS_TICK_INTERVAL}
      minTickGap={XAXIS_TICK_GAP}
      tickLine={false}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
    />
    <YAxis
      axisLine={false}
      width={dataFormat == DataFormat.Percentage ? 33 : 55}
      tick={tickStyle}
      tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
      tickLine={false}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, maximumYValue]}
      allowDataOverflow={false}
    />
    <Tooltip
      formatter={(value: string) => trim(parseFloat(value), 2)}
      content={
        <CustomTooltip
          dataKeyBulletpointStyles={dataKeyBulletpointStyles}
          dataKeyLabels={dataKeyLabels}
          dataFormat={dataFormat}
          dataKeys={dataKeys}
          displayTotal={displayTooltipTotal}
        />
      }
    />
    {dataKeys.map((value: string) => {
      return (
        <Area
          key={value}
          dataKey={value}
          stroke={dataKeyColors.get(value)}
          fill={`url(#${getValidCSSSelector(value, isExpanded)})`}
          fillOpacity={1}
          stackId="1"
        />
      );
    })}
  </AreaChart>
);

/**
 * Renders a composed (area & line) chart.
 */
const renderComposedChart = (
  data: Record<string, unknown>[],
  dataKeys: string[],
  dataKeyColors: Map<string, string>,
  dataFormat: DataFormat,
  dataKeyBulletpointStyles: Map<string, CSSProperties>,
  dataKeyLabels: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  displayTooltipTotal?: boolean,
  composedLineDataKeys?: string[],
  onMouseMove?: CategoricalChartFunc,
) => (
  <ComposedChart data={data} margin={margin} onMouseMove={onMouseMove}>
    <defs>
      {dataKeys.map((value: string) => {
        return (
          <linearGradient key={value} id={getValidCSSSelector(value, isExpanded)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={dataKeyColors.get(value)} stopOpacity={1} />
            <stop offset="100%" stopColor={dataKeyColors.get(value)} stopOpacity={0.5} />
          </linearGradient>
        );
      })}
    </defs>
    <XAxis
      dataKey="timestamp"
      axisLine={false}
      reversed={true}
      padding={{ right: XAXIS_PADDING_RIGHT }}
      // Ticks
      tick={tickStyle}
      interval={XAXIS_TICK_INTERVAL}
      minTickGap={XAXIS_TICK_GAP}
      tickLine={false}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
    />
    <YAxis
      axisLine={false}
      width={dataFormat == DataFormat.Percentage ? 33 : 55}
      tick={tickStyle}
      tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
      tickLine={false}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, maximumYValue]}
      allowDataOverflow={false}
    />
    <Tooltip
      formatter={(value: string) => trim(parseFloat(value), 2)}
      content={
        <CustomTooltip
          dataKeyBulletpointStyles={dataKeyBulletpointStyles}
          dataKeyLabels={dataKeyLabels}
          dataFormat={dataFormat}
          dataKeys={dataKeys}
          dataKeysExcludedFromTotal={composedLineDataKeys}
          displayTotal={displayTooltipTotal}
        />
      }
    />
    {dataKeys.map((value: string) => {
      /**
       * Any elements in the composed data keys are rendered as values
       * on a dashed, thick line.
       */
      if (composedLineDataKeys && composedLineDataKeys.includes(value)) {
        return (
          <Line
            key={value}
            dataKey={value}
            stroke={dataKeyColors.get(value)}
            fill={`url(#${getValidCSSSelector(value, isExpanded)})`}
            dot={false}
            strokeWidth={LINE_STROKE_WIDTH}
            strokeDasharray={"4 1"}
          />
        );
      }

      return (
        <Area
          key={value}
          dataKey={value}
          stroke={dataKeyColors.get(value)}
          fill={`url(#${getValidCSSSelector(value, isExpanded)})`}
          fillOpacity={1}
          stackId="1"
        />
      );
    })}
  </ComposedChart>
);

const renderLineChart = (
  data: Record<string, unknown>[],
  dataKeys: string[],
  dataKeyColors: Map<string, string>,
  dataFormat: DataFormat,
  dataKeyBulletpointStyles: Map<string, CSSProperties>,
  dataKeyLabels: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  scale?: string,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => {
  const dataKey = dataKeys[0];
  const dataKeyColor = dataKeyColors.get(dataKey);

  return (
    <LineChart data={data} margin={margin} onMouseMove={onMouseMove}>
      <XAxis
        dataKey="timestamp"
        interval={100}
        axisLine={false}
        tick={tickStyle}
        tickCount={3}
        tickLine={false}
        reversed={true}
        tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
        padding={{ right: XAXIS_PADDING_RIGHT }}
      />
      <YAxis
        tickCount={scale == "log" ? 1 : isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
        width={32}
        scale={() => scale}
        axisLine={false}
        domain={[scale == "log" ? "dataMin" : 0, maximumYValue]}
        allowDataOverflow={false}
        // Ticks
        tick={tickStyle}
        interval={XAXIS_TICK_INTERVAL}
        minTickGap={XAXIS_TICK_GAP}
        tickLine={false}
        tickFormatter={number => getTickFormatter(dataFormat, number)}
      />
      <Tooltip
        content={
          <CustomTooltip
            dataKeyBulletpointStyles={dataKeyBulletpointStyles}
            dataKeyLabels={dataKeyLabels}
            dataFormat={dataFormat}
            dataKeys={dataKeys}
            displayTotal={displayTooltipTotal}
          />
        }
      />
      <Line type="monotone" dataKey={dataKey} stroke={dataKeyColor} color={dataKeyColor} dot={false} />
    </LineChart>
  );
};

/**
 * Returns true if the value corresponding to keys[0] is greater than keys[1].
 *
 * @param data
 * @param keys
 * @returns
 */
const isLineOneHigher = (data: Record<string, unknown>[], keys: string[]): boolean => {
  if (!data.length) return false;
  if (keys.length < 2) return false;

  if (!objectHasProperty(data[0], keys[0])) {
    throw new Error(`isLineOneHigher: Unable to access ${keys[0]} property in object`);
  }

  if (!objectHasProperty(data[0], keys[1])) {
    throw new Error(`isLineOneHigher: Unable to access ${keys[1]} property in object`);
  }

  const value1 = getFloat(data[0][keys[0]]);
  const value2 = getFloat(data[0][keys[1]]);

  return value1 > value2;
};

const renderAreaDifferenceChart = (
  data: Record<string, unknown>[],
  dataKeys: string[],
  dataKeyColors: Map<string, string>,
  dataFormat: DataFormat,
  dataKeyBulletpointStyles: Map<string, CSSProperties>,
  dataKeyLabels: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  itemDecimals?: number,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => {
  // Intersections code from: https://codesandbox.io/s/qdlyi?file=/src/tests/ComparisonChart.js
  /**
   * We add the "range" key to the incoming data.
   * This contains the lower and higher values for the contents of {dataKey}.
   */
  const dataWithRange = getDataWithRange(data, dataKeys);
  /**
   * This obtains the points where any line intersects with the other,
   * which is used to fill an Area element.
   *
   * The data we receive from the subgraph is in reverse-chronological order.
   * The intersections code relies on the data being in chronological order,
   * so we need to reverse the order of the array without mutating the original
   * one.
   */
  const intersections = getDataIntersections(data.slice().reverse(), dataKeys);
  const nonIntersectingAreaColor = getAreaColor(isLineOneHigher(data, dataKeys));

  /**
   * OlympusDAO/olympus-frontend#2133:
   * We differentiate between the CSS styling for the expanded and standard charts,
   * as closing the expanded chart modal in iOS Safari results in the standard
   * chart being rendered in black. Most likely the CSS styles are unloaded and
   * not restored by the standard chart component.
   */
  const getRangeCssSelector = () => {
    return `color${isExpanded ? "-expanded" : ""}-${RANGE_KEY}`;
  };

  return (
    <ComposedChart data={dataWithRange} margin={margin} onMouseMove={onMouseMove}>
      <defs>
        <linearGradient id={getRangeCssSelector()}>
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
                (intersection.x || 0) /
                (data.filter(value => value[dataKeys[0]] !== undefined && value[dataKeys[1]] != undefined).length - 1);

              return (
                <>
                  <stop offset={offset} stopColor={closeColor} stopOpacity={0.8} />
                  <stop offset={offset} stopColor={startColor} stopOpacity={0.8} />
                </>
              );
            })
          ) : (
            <>
              {/* If there are no intersections in the line, we still want to highlight the area */}
              <stop offset="0%" stopColor={nonIntersectingAreaColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={nonIntersectingAreaColor} stopOpacity={0.8} />
            </>
          )}
        </linearGradient>
      </defs>
      <XAxis
        dataKey="timestamp"
        axisLine={false}
        padding={{ right: XAXIS_PADDING_RIGHT }}
        reversed={true}
        // Ticks
        tick={tickStyle}
        interval={XAXIS_TICK_INTERVAL}
        minTickGap={XAXIS_TICK_GAP}
        tickLine={false}
        tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      />
      <YAxis
        tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
        axisLine={false}
        tick={tickStyle}
        tickLine={false}
        width={25}
        tickFormatter={number => getTickFormatter(dataFormat, number)}
        domain={[0, maximumYValue]}
        allowDataOverflow={false}
      />
      <Tooltip
        content={
          <CustomTooltip
            dataKeyBulletpointStyles={dataKeyBulletpointStyles}
            dataKeyLabels={dataKeyLabels}
            dataFormat={dataFormat}
            itemDecimals={itemDecimals}
            dataKeys={dataKeys}
            displayTotal={displayTooltipTotal}
          />
        }
      />
      <Area dataKey={RANGE_KEY} stroke={dataKeyColors.get(RANGE_KEY)} fill={`url(#${getRangeCssSelector()})`} />
      {dataKeys.map((value: string) => {
        return (
          <Line
            key={value}
            dataKey={value}
            stroke={dataKeyColors.get(value)}
            dot={false}
            strokeWidth={LINE_STROKE_WIDTH}
          />
        );
      })}
    </ComposedChart>
  );
};

const renderMultiLineChart = (
  data: Record<string, unknown>[],
  dataKeys: string[],
  dataKeyColors: Map<string, string>,
  dataFormat: DataFormat,
  dataKeyBulletpointStyles: Map<string, CSSProperties>,
  dataKeyLabels: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  itemDecimals?: number,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => (
  <LineChart data={data} margin={margin} onMouseMove={onMouseMove}>
    <XAxis
      dataKey="timestamp"
      axisLine={false}
      reversed={true}
      padding={{ right: XAXIS_PADDING_RIGHT }}
      // Ticks
      tick={tickStyle}
      interval={XAXIS_TICK_INTERVAL}
      minTickGap={XAXIS_TICK_GAP}
      tickLine={false}
      tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
    />
    <YAxis
      tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
      axisLine={false}
      tickLine={false}
      tick={tickStyle}
      width={25}
      tickFormatter={number => getTickFormatter(dataFormat, number)}
      domain={[0, maximumYValue]}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          dataKeyBulletpointStyles={dataKeyBulletpointStyles}
          dataKeyLabels={dataKeyLabels}
          dataFormat={dataFormat}
          itemDecimals={itemDecimals}
          dataKeys={dataKeys}
          displayTotal={displayTooltipTotal}
        />
      }
    />
    {dataKeys.map((value: string) => {
      return (
        <Line
          key={value}
          dataKey={value}
          stroke={dataKeyColors.get(value)}
          dot={false}
          strokeWidth={LINE_STROKE_WIDTH}
        />
      );
    })}
  </LineChart>
);

// JTBD: Bar chart for Holders
const renderBarChart = (
  data: Record<string, unknown>[],
  dataKeys: string[],
  dataKeyColors: Map<string, string>,
  dataFormat: DataFormat,
  dataKeyBulletpointStyles: Map<string, CSSProperties>,
  dataKeyLabels: Map<string, string>,
  isExpanded: boolean,
  margin: CategoricalChartProps["margin"],
  tickStyle: Record<string, string | number>,
  maximumYValue: number,
  displayTooltipTotal?: boolean,
  onMouseMove?: CategoricalChartFunc,
) => {
  const dataKey = dataKeys[0];
  const dataKeyColor = dataKeyColors.get(dataKey);

  return (
    <BarChart data={data} margin={margin} onMouseMove={onMouseMove}>
      <XAxis
        dataKey="timestamp"
        axisLine={false}
        reversed={true}
        padding={{ right: XAXIS_PADDING_RIGHT }}
        // Ticks
        tick={tickStyle}
        interval={XAXIS_TICK_INTERVAL}
        minTickGap={XAXIS_TICK_GAP}
        tickLine={false}
        tickFormatter={str => getTickFormatter(DataFormat.DateMonth, str)}
      />
      <YAxis
        axisLine={false}
        tick={tickStyle}
        tickLine={false}
        tickCount={isExpanded ? TICK_COUNT_EXPANDED : TICK_COUNT}
        width={33}
        domain={[0, maximumYValue]}
        allowDataOverflow={false}
        tickFormatter={number => (number !== 0 ? number : "")}
      />
      <Tooltip
        content={
          <CustomTooltip
            dataKeyBulletpointStyles={dataKeyBulletpointStyles}
            dataKeyLabels={dataKeyLabels}
            dataFormat={dataFormat}
            dataKeys={dataKeys}
            displayTotal={displayTooltipTotal}
          />
        }
      />
      <Bar dataKey={dataKey} fill={dataKeyColor} />
    </BarChart>
  );
};

/**
 * Functional React component that renders a chart with tooltips.
 *
 * @param param0
 * @returns
 */
function Chart({
  type,
  data,
  scale,
  dataKeys,
  dataKeyColors,
  headerText,
  dataFormat,
  headerSubText,
  dataKeyBulletpointStyles,
  dataKeyLabels,
  infoTooltipMessage,
  isLoading,
  tickStyle,
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  itemDecimals,
  subgraphQueryUrl,
  displayTooltipTotal,
  composedLineDataKeys,
  onMouseMove,
}: {
  type: ChartType;
  data: Record<string, unknown>[];
  scale?: string;
  /** string array with all of the dataKeys that should be rendered */
  dataKeys: string[];
  /** mapping of data keys to colors used for stroke/fill */
  dataKeyColors: Map<string, string>;
  headerText: string;
  dataFormat: DataFormat;
  headerSubText: string;
  /** map between data keys and the color of the bulletpoint */
  dataKeyBulletpointStyles: Map<string, CSSProperties>;
  /** map between data keys and their labels */
  dataKeyLabels: Map<string, string>;
  infoTooltipMessage: string;
  isLoading: boolean;
  tickStyle: Record<string, string | number>;
  margin?: CategoricalChartProps["margin"];
  itemDecimals?: number;
  subgraphQueryUrl?: string;
  displayTooltipTotal?: boolean;
  /** optional string array with the dataKeys that should be rendered as lines */
  composedLineDataKeys?: string[];
  onMouseMove?: CategoricalChartFunc;
}) {
  const [open, setOpen] = useState(false);
  const [maximumYValue, setMaximumYValue] = useState(0.0);

  /**
   * Recharts has a bug where using "auto" or "dataMax" as the
   * higher value in the domain does not always result
   * in rendering all of the data. So we calculate the
   * maximum value in the y-axis manually.
   *
   * It is inclosed in useMemo, as it will only need to be recalculated when
   * the dependencies change.
   */
  useMemo(() => {
    if (!data || !data.length) {
      setMaximumYValue(0.0);
      return;
    }

    const tempMaxValue = getMaximumValue(data, dataKeys, type, composedLineDataKeys);
    // Give a bit of a buffer
    setMaximumYValue(tempMaxValue * 1.1);
  }, [data, dataKeys, type, composedLineDataKeys]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderChart = (type: ChartType, isExpanded: boolean) => {
    switch (type) {
      case ChartType.Line: {
        return renderLineChart(
          data,
          dataKeys,
          dataKeyColors,
          dataFormat,
          dataKeyBulletpointStyles,
          dataKeyLabels,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          scale,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.Area: {
        return renderAreaChart(
          data,
          dataKeys,
          dataKeyColors,
          dataFormat,
          dataKeyBulletpointStyles,
          dataKeyLabels,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.StackedArea: {
        return renderStackedAreaChart(
          data,
          dataKeys,
          dataKeyColors,
          dataFormat,
          dataKeyBulletpointStyles,
          dataKeyLabels,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.MultiLine: {
        return renderMultiLineChart(
          data,
          dataKeys,
          dataKeyColors,
          dataFormat,
          dataKeyBulletpointStyles,
          dataKeyLabels,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          itemDecimals,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.AreaDifference: {
        return renderAreaDifferenceChart(
          data,
          dataKeys,
          dataKeyColors,
          dataFormat,
          dataKeyBulletpointStyles,
          dataKeyLabels,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          itemDecimals,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.Bar: {
        return renderBarChart(
          data,
          dataKeys,
          dataKeyColors,
          dataFormat,
          dataKeyBulletpointStyles,
          dataKeyLabels,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          displayTooltipTotal,
          onMouseMove,
        );
      }
      case ChartType.Composed: {
        return renderComposedChart(
          data,
          dataKeys,
          dataKeyColors,
          dataFormat,
          dataKeyBulletpointStyles,
          dataKeyLabels,
          isExpanded,
          margin,
          tickStyle,
          maximumYValue,
          displayTooltipTotal,
          composedLineDataKeys,
          onMouseMove,
        );
      }
      default: {
        return <></>;
      }
    }
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
      <ResponsiveContainer height={DEFAULT_HEIGHT} width="99%">
        {renderChart(type, false)}
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default Chart;
