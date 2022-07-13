import "./customtooltip.scss";

import { Box, Grid, Paper, Typography } from "@mui/material";
import { CSSProperties } from "react";
import { formatCurrency } from "src/helpers";

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
    const currentValueNum = typeof current.value === "number" ? current.value : parseFloat(current.value);

    return prev + currentValueNum;
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

  return isStaked ? (
    <Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColorsArray[0]}></span>
          Staked
        </Typography>
        <Typography>{`${Math.round(payload[0].value)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColorsArray[1]}></span>
          Not staked
        </Typography>
        <Typography>{`${Math.round(100 - payload[0].value)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : isPOL ? (
    <Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColorsArray[0]}></span>
          {categoriesArray[0]}
        </Typography>
        <Typography>{`${Math.round(payload[0].value)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColorsArray[1]}></span>
          <span className="tooltip-name">{categoriesArray[1]}</span>
        </Typography>
        <Typography>{`${Math.round(100 - payload[0].value)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : (
    <Grid container xs={12}>
      <Grid item xs={12} style={{ marginBottom: "20px" }}>
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
            <Grid item xs={8}>
              <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
                <span className="tooltip-bulletpoint" style={bulletpointColors.get(item.dataKey)}></span>
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
  if (active && payload && payload.length) {
    return (
      <Paper className={`ohm-card tooltip-container`} style={{ width: "300px" }}>
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
