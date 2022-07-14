import { Box, Grid, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CSSProperties } from "react";
import { formatCurrency } from "src/helpers";
import { getFloat } from "src/helpers/NumberHelper";

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
 * @param index
 * @param payload
 * @param item
 * @returns
 */
const renderDate = (index: number, payload: TooltipPayloadItem[], item: TooltipPayloadItem) => {
  const date = new Date(item.payload.timestamp * 1000);

  return index === payload.length - 1 ? (
    <div className="tooltip-date">
      {date.toLocaleString("default", { month: "long" }).charAt(0).toUpperCase()}
      {date.toLocaleString("default", { month: "long" }).slice(1)}
      &nbsp;
      {date.getDate()}, {date.getFullYear()}
    </div>
  ) : (
    ""
  );
};

const formatText = (type: string, item: number, decimals: number) => {
  return type === "$" ? formatCurrency(item, decimals) : `${Math.round(item).toLocaleString("en-US")}${type}`;
};

const renderItem = (type: string, item: number, decimals = 0) => {
  return <Typography variant="body2">{formatText(type, item, decimals)}</Typography>;
};

const renderTotal = (type: string, payload: TooltipPayloadItem[]) => {
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
  itemType: string,
  dataKey: string[],
  isStaked = false,
  isPOL = false,
  itemDecimals = 0,
  displayTotal = false,
) => {
  let ignoredIndex = 0;

  const categoriesArray = Array.from(categories.values());
  const bulletpointColorsArray = Array.from(bulletpointColors.values());
  const containerProps = {
    padding: "20px",
  };
  const bulletpointStyle = {
    display: "inline-block",
    width: "1em",
    height: "1em",
    borderRadius: "50%",
    marginRight: "5px",
    verticalAlign: "top",
  };

  return isStaked ? (
    <Box {...containerProps}>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span style={{ ...bulletpointStyle, ...bulletpointColorsArray[0] }}></span>
          Staked
        </Typography>
        <Typography>{`${Math.round(payload[0].value)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span style={{ ...bulletpointStyle, ...bulletpointColorsArray[1] }}></span>
          Not staked
        </Typography>
        <Typography>{`${Math.round(100 - payload[0].value)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : isPOL ? (
    <Box {...containerProps}>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span style={{ ...bulletpointStyle, ...bulletpointColorsArray[0] }}></span>
          {categoriesArray[0]}
        </Typography>
        <Typography>{`${Math.round(payload[0].value)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span style={{ ...bulletpointStyle, ...bulletpointColorsArray[1] }}></span>
          <span className="tooltip-name">{categoriesArray[1]}</span>
        </Typography>
        <Typography>{`${Math.round(100 - payload[0].value)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : (
    <Grid container xs={12} {...containerProps}>
      <Grid item xs={12} marginBottom="20px">
        {renderDate(payload.length - 1, payload, payload[0])}
      </Grid>
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
              <span style={{ ...bulletpointStyle, ...bulletpointColors.get(item.dataKey) }}></span>
              <Typography variant="body2" display="inline">
                {`${categories.get(item.dataKey)}`}
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              {renderItem(itemType, item.value, itemDecimals)}
            </Grid>
          </Grid>
        );
      })}
      {displayTotal && renderTotal(itemType, payload)}
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
  itemType,
  dataKey,
  isStaked,
  isPOL,
  itemDecimals,
  displayTotal,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  bulletpointColors: Map<string, CSSProperties>;
  categories: Map<string, string>;
  itemType: string;
  dataKey: string[];
  isStaked?: boolean;
  isPOL?: boolean;
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
        {renderTooltipItems(
          payload,
          bulletpointColors,
          categories,
          itemType,
          dataKey,
          isStaked,
          isPOL,
          itemDecimals,
          displayTotal,
        )}
      </Paper>
    );
  }
  return null;
}

export default CustomTooltip;
