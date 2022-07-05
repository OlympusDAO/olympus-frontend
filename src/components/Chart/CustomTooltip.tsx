import "./customtooltip.scss";

import { Box, Paper, Typography } from "@mui/material";
import { CSSProperties } from "react";
import { formatCurrency } from "src/helpers";

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  payload: {
    timestamp: number;
  };
}
const renderDate = (index: number, payload: TooltipPayloadItem[], item: TooltipPayloadItem) => {
  return index === payload.length - 1 ? (
    <div className="tooltip-date">
      {new Date(item.payload.timestamp * 1000).toLocaleString("default", { month: "long" }).charAt(0).toUpperCase()}
      {new Date(item.payload.timestamp * 1000).toLocaleString("default", { month: "long" }).slice(1)}
      &nbsp;
      {new Date(item.payload.timestamp * 1000).getDate()}, {new Date(item.payload.timestamp * 1000).getFullYear()}
    </div>
  ) : (
    ""
  );
};

const renderItem = (type: string, item: number, decimals = 0) => {
  return type === "$" ? (
    <Typography variant="body2">{`${formatCurrency(item, decimals)}`}</Typography>
  ) : (
    <Typography variant="body2">{`${Math.round(item).toLocaleString("en-US")}${type}`}</Typography>
  );
};

const renderTooltipItems = (
  payload: TooltipPayloadItem[],
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  dataKey: string[],
  isStaked = false,
  isPOL = false,
  itemDecimals = 0,
) => {
  let ignoredIndex = 0;

  return isStaked ? (
    <Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColors[0]}></span>
          Staked
        </Typography>
        <Typography>{`${Math.round(payload[0].value)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColors[1]}></span>
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
          <span className="tooltip-bulletpoint" style={bulletpointColors[0]}></span>
          {itemNames[0]}
        </Typography>
        <Typography>{`${Math.round(payload[0].value)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2">
          <span className="tooltip-bulletpoint" style={bulletpointColors[1]}></span>
          <span className="tooltip-name">{itemNames[1]}</span>
        </Typography>
        <Typography>{`${Math.round(100 - payload[0].value)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : (
    payload.map((item, index) => {
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
        <Box key={adjustedIndex}>
          <Box className="item" display="flex">
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">
                <span className="tooltip-bulletpoint" style={bulletpointColors[adjustedIndex]}></span>
                {`${itemNames[adjustedIndex]}`}
              </Typography>
            </Box>
            <span style={{ marginLeft: "20px" }}>{renderItem(itemType, item.value, itemDecimals)}</span>
          </Box>
          <Box>{renderDate(adjustedIndex, payload, item)}</Box>
        </Box>
      );
    })
  );
};
function CustomTooltip({
  active,
  payload,
  bulletpointColors,
  itemNames,
  itemType,
  dataKey,
  isStaked,
  isPOL,
  itemDecimals,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  bulletpointColors: CSSProperties[];
  itemNames: string[];
  itemType: string;
  dataKey: string[];
  isStaked?: boolean;
  isPOL?: boolean;
  itemDecimals?: number;
}) {
  if (active && payload && payload.length) {
    return (
      <Paper className={`ohm-card tooltip-container`}>
        {renderTooltipItems(payload, bulletpointColors, itemNames, itemType, dataKey, isStaked, isPOL, itemDecimals)}
      </Paper>
    );
  }
  return null;
}

export default CustomTooltip;
