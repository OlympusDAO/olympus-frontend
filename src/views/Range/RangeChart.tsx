import { Box, CircularProgress } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { DataRow, Paper } from "@olympusdao/component-library";
import {
  Area,
  ComposedChart,
  Label,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { formatCurrency, parseBigNumber, trim } from "src/helpers";
import { OperatorMovingAverage, OperatorTargetPrice, PriceHistory } from "src/views/Range/hooks";

const PREFIX = "RangeChart";

const classes = {
  currentPrice: `${PREFIX}-currentPrice`,
};

const StyledResponsiveContainer = styled(ResponsiveContainer)(({ theme }) => ({
  [`& .${classes.currentPrice}`]: {
    fill: theme.palette.primary.main,
    fontWeight: 600,
  },
  [`& .moving-average`]: {
    fill: theme.colors.gray[500],
    fontSize: "18px",
  },
}));

/**
 * Component for Displaying RangeChart
 */
const RangeChart = (props: {
  rangeData: any;
  currentPrice: number;
  bidPrice: number;
  askPrice: number;
  sellActive: boolean;
  reserveSymbol: string;
}) => {
  const { rangeData, currentPrice, bidPrice, askPrice, reserveSymbol } = props;
  //TODO - Figure out which Subgraphs to query. Currently Uniswap.
  const { data: priceData, isFetched } = PriceHistory({ reserveSymbol });

  const { data: targetPrice } = OperatorTargetPrice();
  const { data: movingAverage } = OperatorMovingAverage();

  const formattedWallHigh = trim(parseBigNumber(rangeData.wall.high.price, 18), 2);
  const formattedWallLow = trim(parseBigNumber(rangeData.wall.low.price, 18), 2);
  const formattedCushionHigh = trim(parseBigNumber(rangeData.cushion.high.price, 18), 2);
  const formattedCushionLow = trim(parseBigNumber(rangeData.cushion.low.price, 18), 2);
  const chartData = priceData.map((item: any) => {
    return {
      ...item,
      timestamp: item.timestamp,
      uv: [formattedWallHigh, formattedCushionHigh],
      lv: [formattedWallLow, formattedCushionLow],
      ma: targetPrice,
    };
  });

  /* We load an object at the front of the chartData array
   * with no price data to shift the chart line left and add an extra element with current market price
   */
  chartData.unshift(
    {
      uv: [formattedWallHigh, formattedCushionHigh],
      lv: [formattedWallLow, formattedCushionLow],
      ma: targetPrice,
    },
    {
      price: currentPrice,
      timestamp: "now",
      uv: [formattedWallHigh, formattedCushionHigh],
      lv: [formattedWallLow, formattedCushionLow],
      ma: targetPrice,
    },
  );

  const CustomReferenceDot = (props: {
    cx: string | number | undefined;
    cy: string | number | undefined;
    fill: string;
  }) => {
    return (
      <>
        <circle cx={props.cx} cy={props.cy} fill={props.fill} r="8"></circle>
        <circle cx={props.cx} cy={props.cy} fill={props.fill} r="8">
          <animate
            attributeName="opacity"
            keyTimes="0; .5; 1"
            values="0; 1; 0"
            dur="1.5s"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate attributeName="r" keyTimes="0; 1" values="8; 20" dur="1.5s" begin="0s" repeatCount="indefinite" />
        </circle>
      </>
    );
  };

  const capacityFormatter = Intl.NumberFormat("en", { notation: "compact" });

  //adjust chart layout labels if dots are too close

  const askPriceDelta = chartData[1].price - askPrice; //if negative ask is above price
  const bidPriceDelta = chartData[1].price - bidPrice; // if negative bid is above price
  const isSquishyAsk = askPriceDelta < 1.25 && askPriceDelta > -1.25;
  const isSquishyBid = bidPriceDelta < 1.25 && bidPriceDelta > -1.25;

  const TooltipContent = ({ payload, label }: TooltipProps<number, NameType>) => {
    const price = payload && payload.length > 4 ? payload[4].value : currentPrice;
    const timestamp = payload && payload.length > 4 ? payload[4].payload.timestamp : "";
    return (
      <Paper className={`ohm-card tooltip-container`} sx={{ minWidth: "250px" }}>
        <DataRow title="Price" balance={formatCurrency(price ? price : currentPrice, 2, reserveSymbol)} />
        <DataRow title="Time" balance={timestamp}></DataRow>
        {label === "now" && (
          <>
            <DataRow
              title="Upper Wall"
              balance={formatCurrency(parseBigNumber(rangeData.wall.high.price, 18), 2, reserveSymbol)}
            />
            <DataRow
              title="Upper Cushion"
              balance={formatCurrency(parseBigNumber(rangeData.cushion.high.price, 18), 2, reserveSymbol)}
            />
            <DataRow
              title="Lower Cushion"
              balance={formatCurrency(parseBigNumber(rangeData.cushion.low.price, 18), 2, reserveSymbol)}
            />
            <DataRow
              title="Lower Wall"
              balance={formatCurrency(parseBigNumber(rangeData.wall.low.price, 18), 2, reserveSymbol)}
            />
            <DataRow
              title="Upper Capacity"
              balance={`${capacityFormatter.format(parseBigNumber(rangeData.high.capacity, 9))} OHM`}
            />
            <DataRow
              title="Lower Capacity"
              balance={`${capacityFormatter.format(parseBigNumber(rangeData.low.capacity, 18))} ${reserveSymbol} `}
            />
            <DataRow title="Target Price" balance={`${formatCurrency(targetPrice, 2, reserveSymbol)}`} />
            <DataRow title="30 Day MA" balance={`${formatCurrency(movingAverage.movingAverage, 2, reserveSymbol)}`} />
          </>
        )}
      </Paper>
    );
  };

  const theme = useTheme();
  return isFetched ? (
    <Box bgcolor={theme.colors.gray[700]} borderRadius="12px" px={2}>
      <StyledResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <defs>
            <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#8B5559" strokeWidth="1" />
            </pattern>
            <pattern id="diagonalHatchLow" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#596D66" strokeWidth="1" />
            </pattern>
          </defs>
          <ReferenceLine
            y={targetPrice}
            stroke={theme.colors.gray[500]}
            strokeDasharray={"6 3"}
            strokeWidth={0.5}
            className="moving-average"
            label={targetPrice ? `Target Price: ${formatCurrency(targetPrice, 2, reserveSymbol)}` : ""}
            position="start"
          />
          <XAxis reversed scale="auto" dataKey="timestamp" interval="preserveStartEnd" tick={false} hide></XAxis>
          <YAxis
            scale="auto"
            tickFormatter={number => formatCurrency(number, 2, reserveSymbol)}
            orientation="left"
            type="number"
            domain={[
              (dataMin: number) =>
                Math.min(dataMin, askPrice, bidPrice, parseBigNumber(rangeData.wall.low.price, 18)) * 0.95,
              (dataMax: number) =>
                Math.max(dataMax, askPrice, bidPrice, parseBigNumber(rangeData.wall.low.price, 18)) * 1.05,
            ]}
            padding={{ top: 20, bottom: 20 }}
            tick={false}
            hide
          />
          <Tooltip content={<TooltipContent />} />
          <Area
            type="monotone"
            dataKey="uv"
            fill={rangeData.high.active ? theme.colors.feedback.error : theme.colors.gray[500]}
            stroke={rangeData.high.active ? theme.colors.feedback.error : theme.colors.gray[500]}
            strokeDasharray={"6 3"}
            strokeWidth={1}
            fillOpacity={0.4}
          />
          <Area
            type="monotone"
            dataKey="uv"
            fill="url(#diagonalHatch)"
            stroke={rangeData.high.active ? theme.colors.feedback.error : theme.colors.gray[500]}
            strokeDasharray={"6 3"}
            strokeWidth={1}
            fillOpacity={0.4}
          />
          <Area
            type="linear"
            fill={rangeData.low.active ? theme.colors.feedback.success : theme.colors.gray[500]}
            dataKey="lv"
            stroke={rangeData.low.active ? theme.colors.feedback.success : theme.colors.gray[500]}
            dot={false}
            fillOpacity={0.4}
            strokeDasharray="6 3"
            strokeWidth={1}
          />
          <Area
            type="linear"
            fill="url(#diagonalHatchLow)"
            dataKey="lv"
            stroke={rangeData.low.active ? theme.colors.feedback.success : theme.colors.gray[500]}
            dot={false}
            strokeDasharray="6 3"
            strokeWidth={1}
            fillOpacity={0.4}
          />
          <Line type="monotone" dataKey="price" stroke={theme.colors.gray[10]} dot={false} strokeWidth={4} />

          <ReferenceDot
            x={"now"}
            y={chartData.length > 1 && chartData[1].price}
            shape={CustomReferenceDot}
            fill={theme.colors.gray[10]}
          >
            <Label
              className={classes.currentPrice}
              position={(isSquishyBid && bidPriceDelta < 0) || (isSquishyAsk && askPriceDelta < 0) ? "bottom" : "top"}
            >
              {formatCurrency(chartData.length > 1 && chartData[1].price, 2, reserveSymbol)}
            </Label>
          </ReferenceDot>
          <ReferenceDot x={"now"} y={askPrice} shape={CustomReferenceDot} fill="#F8CC82">
            <Label className={classes.currentPrice} position={isSquishyAsk && askPriceDelta < 0 ? "top" : "bottom"}>
              {`Ask: ${formatCurrency(askPrice, 2, reserveSymbol)}`}
            </Label>
          </ReferenceDot>

          <ReferenceDot x={"now"} y={bidPrice} shape={CustomReferenceDot} fill={theme.colors.primary[300]}>
            <Label className={classes.currentPrice} position={isSquishyBid && bidPriceDelta < 0 ? "top" : "bottom"}>
              {`Bid: ${formatCurrency(bidPrice, 2, reserveSymbol)}`}
            </Label>
          </ReferenceDot>
        </ComposedChart>
      </StyledResponsiveContainer>
    </Box>
  ) : (
    <Box display="flex" justifyContent="center" mt={20} mb={20}>
      <CircularProgress />
    </Box>
  );
};

export default RangeChart;
