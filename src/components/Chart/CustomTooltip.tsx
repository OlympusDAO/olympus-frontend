import { Grid, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { CSSProperties } from "react";
import { DataFormat } from "src/components/Chart/Constants";
import { formatCurrency } from "src/helpers";
import { getFloat } from "src/helpers/NumberHelper";

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  payload: {
    date: string;
    timestamp: number;
    block: number;
  };
}

/**
 * Renders the date in the format: "May 30, 2022"
 *
 * As of OlympusDAO/olympus-frontend#2134, this showed the block number.
 * Following the addition of multi-chain assets (which have different block numbers),
 * the block number was removed.
 *
 * @param item
 * @returns
 */
const renderDate = (item: TooltipPayloadItem) => {
  const date = new Date(item.payload.timestamp);

  return (
    <>
      <Grid item xs={12} marginBottom="5px">
        {
          // Format: October 10, 2022 - 01:22 UTC
          // The `slice` approach is documented here: https://stackoverflow.com/a/3605248
          `${date.toLocaleString("default", {
            month: "long",
            timeZone: "UTC",
          })} ${date.getUTCDate()}, ${date.getUTCFullYear()} - ${`0${date.getUTCHours()}`.slice(
            -2,
          )}:${`0${date.getUTCMinutes()}`.slice(-2)} UTC`
        }
      </Grid>
    </>
  );
};

/**
 * Format number as a string based on the data format specified by {type}.
 *
 * @param type
 * @param item
 * @param decimals
 * @returns
 */
const formatNumber = (type: DataFormat, item: number, decimals: number) => {
  return type === DataFormat.Currency ? formatCurrency(item, decimals) : `${Math.round(item).toLocaleString("en-US")}`;
};

const renderItem = (type: DataFormat, item: number, decimals = 0) => {
  return <Typography variant="body2">{formatNumber(type, item, decimals)}</Typography>;
};

/**
 * Render the total for a given array of payloads.
 *
 * @param type
 * @param payloadItems
 * @param dataKeysExcludedFromTotal optional array of data keys that will be excluded from the total
 * @returns
 */
const renderTotal = (
  type: DataFormat,
  payloadItems: TooltipPayloadItem[],
  dataKeysExcludedFromTotal: string[] | undefined,
) => {
  const total = payloadItems.reduce((prev, current) => {
    // Skip ignored data keys
    if (dataKeysExcludedFromTotal && dataKeysExcludedFromTotal.includes(current.dataKey)) {
      return prev;
    }

    return prev + getFloat(current.value);
  }, 0);

  return (
    <Grid item xs={12}>
      <Typography variant="body2" align="right" fontWeight={500}>
        Total: {formatNumber(type, total, 0)}
      </Typography>
    </Grid>
  );
};

/**
 * Renders a row with a bulletpoint.
 *
 * @param dataKeyBulletpointStyles Mapping between data keys and the bulletpoint style
 * @param dataKeyLabels Mapping between data keys and the label
 * @param dataFormat Data type
 * @param itemDecimals Number of decimals to display
 * @param index Row index
 * @param item Payload item
 */
const renderBulletpointRow = (
  dataKeyBulletpointStyles: Map<string, CSSProperties>,
  dataKeyLabels: Map<string, string>,
  dataFormat: DataFormat,
  itemDecimals: number,
  index: number,
  item: TooltipPayloadItem,
) => {
  const bulletpointStyle = {
    display: "inline-block",
    width: "1em",
    height: "1em",
    borderRadius: "50%",
    marginRight: "5px",
    verticalAlign: "top",
    ...dataKeyBulletpointStyles.get(item.dataKey),
  };

  // Don't render a tooltip row if the value is 0 (#2673)
  if (!item.value) {
    return <React.Fragment key={item.dataKey}></React.Fragment>;
  }

  return (
    <Grid
      item
      container
      xs={12}
      alignContent="center"
      justifyContent="space-between"
      style={{ marginBottom: "2px" }}
      key={item.dataKey}
    >
      <Grid item xs={1} alignContent="left">
        <span style={bulletpointStyle}></span>
      </Grid>
      <Grid item xs={7} alignContent="left">
        <Typography variant="body2">{`${dataKeyLabels.get(item.dataKey)}`}</Typography>
      </Grid>
      <Grid item xs={4} textAlign="right">
        {renderItem(dataFormat, item.value, itemDecimals)}
      </Grid>
    </Grid>
  );
};

const renderTooltipItems = (
  payload: TooltipPayloadItem[],
  dataKeyBulletpointStyles: Map<string, CSSProperties>,
  dataKeyLabels: Map<string, string>,
  dataFormat: DataFormat,
  dataKey: string[],
  itemDecimals = 0,
  displayTotal = false,
  dataKeysExcludedFromTotal?: string[],
) => {
  let ignoredIndex = 0;

  return (
    <Grid container padding={"10px"}>
      {renderDate(payload[0])}
      {payload
        .map((item, index) => {
          const label: string = dataKeyLabels.get(item.dataKey) || item.dataKey;
          /**
           * The "range" area element triggers showing a tooltip. To avoid this,
           * we restrict the tooltips to those included in the {dataKey} array.
           */
          if (
            !dataKey.includes(item.dataKey) ||
            (dataKeysExcludedFromTotal && dataKeysExcludedFromTotal.includes(item.dataKey))
          ) {
            ignoredIndex++;
            return { label: label, element: <React.Fragment key={item.dataKey}></React.Fragment> };
          }

          const adjustedIndex = index - ignoredIndex;

          return {
            label: label,
            element: renderBulletpointRow(
              dataKeyBulletpointStyles,
              dataKeyLabels,
              dataFormat,
              itemDecimals,
              adjustedIndex,
              item,
            ),
          };
        })
        // Sort tooltip entries alphabetically
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(item => item.element)}
      {displayTotal && renderTotal(dataFormat, payload, dataKeysExcludedFromTotal)}
      <Grid item xs={12} marginBottom="10px" />
      {
        // Display elements of totalExcludesDataKeys below the total
        payload.map((item, index) => {
          if (!dataKeysExcludedFromTotal || !dataKeysExcludedFromTotal.includes(item.dataKey)) {
            ignoredIndex++;
            return <React.Fragment key={item.dataKey}></React.Fragment>;
          }

          const adjustedIndex = index - ignoredIndex;

          return renderBulletpointRow(
            dataKeyBulletpointStyles,
            dataKeyLabels,
            dataFormat,
            itemDecimals,
            adjustedIndex,
            item,
          );
        })
      }
    </Grid>
  );
};

/**
 * Function React component that renders a custom tooltip in a chart.
 *
 * As the presence of the data keys can differ, the {dataKeyLabels}
 * and {bulletpointColors} props are maps. This keeps the
 * bullpoint color consistent with the charts rendering.
 *
 * @returns
 */
function CustomTooltip({
  active,
  payload,
  dataKeyBulletpointStyles,
  dataKeyLabels,
  dataFormat,
  dataKeys,
  itemDecimals,
  displayTotal,
  dataKeysExcludedFromTotal,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  dataKeyBulletpointStyles: Map<string, CSSProperties>;
  dataKeyLabels: Map<string, string>;
  dataFormat: DataFormat;
  dataKeys: string[];
  itemDecimals?: number;
  displayTotal?: boolean;
  dataKeysExcludedFromTotal?: string[];
}) {
  const theme = useTheme();

  if (active && payload && payload.length) {
    return (
      <Paper
        style={{
          border: "1px solid rgba(118, 130, 153, 0.2)",
          minWidth: "175px",
          width: "300px",
          background: theme.palette.background.paper,
        }}
      >
        {renderTooltipItems(
          payload,
          dataKeyBulletpointStyles,
          dataKeyLabels,
          dataFormat,
          dataKeys,
          itemDecimals,
          displayTotal,
          dataKeysExcludedFromTotal,
        )}
      </Paper>
    );
  }
  return null;
}

export default CustomTooltip;
