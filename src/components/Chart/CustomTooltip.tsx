import { Grid, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CSSProperties } from "react";
import { formatCurrency } from "src/helpers";
import { getFloat } from "src/helpers/NumberHelper";

import { DataFormat } from "./Constants";

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  payload: {
    timestamp: number;
  };
}

/**
 * Renders the date in the format: "May 30, 2022"
 *
 * @param item
 * @returns
 */
const renderDate = (item: TooltipPayloadItem) => {
  const date = new Date(item.payload.timestamp * 1000);

  return (
    <Grid item xs={12} marginBottom="20px">
      {date.toLocaleString("default", { month: "long" }).charAt(0).toUpperCase()}
      {date.toLocaleString("default", { month: "long" }).slice(1)}
      &nbsp;
      {date.getDate()}, {date.getFullYear()}
    </Grid>
  );
};

const formatText = (type: DataFormat, item: number, decimals: number) => {
  return type === DataFormat.Currency
    ? formatCurrency(item, decimals)
    : `${Math.round(item).toLocaleString("en-US")}${type}`;
};

const renderItem = (type: DataFormat, item: number, decimals = 0) => {
  return <Typography variant="body2">{formatText(type, item, decimals)}</Typography>;
};

const renderTotal = (type: DataFormat, payload: TooltipPayloadItem[]) => {
  const total = payload.reduce((prev, current) => {
    return prev + getFloat(current.value);
  }, 0);

  return (
    <Grid item xs={12}>
      <Typography variant="body2" align="right" fontWeight={500}>
        {formatText(type, total, 0)}
      </Typography>
    </Grid>
  );
};

const renderTooltipItems = (
  payload: TooltipPayloadItem[],
  bulletpointColors: Map<string, CSSProperties>,
  categories: Map<string, string>,
  dataFormat: DataFormat,
  dataKey: string[],
  itemDecimals = 0,
  displayTotal = false,
) => {
  let ignoredIndex = 0;

  return (
    <Grid container xs={12} padding={"20px"}>
      {renderDate(payload[0])}
      {payload.map((item, index) => {
        /**
         * The "range" area element triggers showing a tooltip. To avoid this,
         * we restrict the tooltips to those included in the {dataKey} array.
         */
        if (!dataKey.includes(item.dataKey)) {
          ignoredIndex++;
          return <></>;
        }

        const adjustedIndex = index - ignoredIndex;
        const bulletpointStyle = {
          display: "inline-block",
          width: "1em",
          height: "1em",
          borderRadius: "50%",
          marginRight: "5px",
          verticalAlign: "top",
          ...bulletpointColors.get(item.dataKey),
        };

        return (
          <Grid
            item
            container
            xs={12}
            alignContent="center"
            justifyContent="space-between"
            style={{ marginBottom: "10px" }}
            key={adjustedIndex}
          >
            <Grid item xs={8} alignContent="center">
              <span style={bulletpointStyle}></span>
              <Typography variant="body2" display="inline">
                {`${categories.get(item.dataKey)}`}
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              {renderItem(dataFormat, item.value, itemDecimals)}
            </Grid>
          </Grid>
        );
      })}
      {displayTotal && renderTotal(dataFormat, payload)}
    </Grid>
  );
};

/**
 * React Component that renders a custom tooltip in a chart.
 *
 * As the presence of the data keys can differ, the {categories}
 * and {bulletpointColors} props are maps. This keeps the
 * bullpoint color consistent with the charts rendering.
 *
 * @returns
 */
function CustomTooltip({
  active,
  payload,
  bulletpointColors,
  categories,
  dataFormat,
  dataKey,
  itemDecimals,
  displayTotal,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  bulletpointColors: Map<string, CSSProperties>;
  categories: Map<string, string>;
  dataFormat: DataFormat;
  dataKey: string[];
  itemDecimals?: number;
  displayTotal?: boolean;
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
        {renderTooltipItems(payload, bulletpointColors, categories, dataFormat, dataKey, itemDecimals, displayTotal)}
      </Paper>
    );
  }
  return null;
}

export default CustomTooltip;
