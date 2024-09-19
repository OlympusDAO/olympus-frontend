import { Box, CircularProgress, Typography } from "@mui/material";
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
import { formatCurrency, parseBigNumber } from "src/helpers";
import { RANGEv2 as OlympusRange } from "src/typechain/Range";
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
  rangeData: OlympusRange.RangeStructOutput;
  currentPrice: number;
  bidPrice: number;
  askPrice: number;
  sellActive: boolean;
  reserveSymbol: string;
}) => {
  const { rangeData, currentPrice, bidPrice, askPrice, reserveSymbol } = props;
  //TODO - Figure out which Subgraphs to query. Currently Uniswap.
  const { data: priceData, isFetched } = PriceHistory();

  const { data: targetPrice } = OperatorTargetPrice();
  const { data: movingAverage } = OperatorMovingAverage();

  const chartData = priceData.map((item, index) => {
    const isFirstItem = index === 0;

    return {
      price: parseFloat(item.snapshot.ohmPrice),
      timestamp: isFirstItem ? "now" : item.snapshot.timestamp,
      uv: [item.snapshot.highWallPrice, item.snapshot.highCushionPrice],
      lv: [item.snapshot.lowWallPrice, item.snapshot.lowCushionPrice],
      ma: parseFloat(item.snapshot.ohmMovingAveragePrice),
    };
  });

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

  const askPriceDelta = chartData.length > 1 ? chartData[1].price - askPrice : undefined; //if negative ask is above price
  const bidPriceDelta = chartData.length > 1 ? chartData[1].price - bidPrice : undefined; // if negative bid is above price
  const isSquishyAsk = askPriceDelta && askPriceDelta < 1.25 && askPriceDelta > -1.25;
  const isSquishyBid = bidPriceDelta && bidPriceDelta < 1.25 && bidPriceDelta > -1.25;

  const TooltipContent = ({ payload, label }: TooltipProps<number, NameType>) => {
    const price = payload && payload.length > 4 ? payload[4].value : currentPrice;
    const timestamp = payload && payload.length > 4 ? payload[4].payload.timestamp : "";
    const lowerCushion = payload && payload.length > 4 ? payload[4].payload.lv[1] : "";
    const lowerWall = payload && payload.length > 4 ? payload[4].payload.lv[0] : "";
    const upperCushion = payload && payload.length > 4 ? payload[4].payload.uv[1] : "";
    const upperWall = payload && payload.length > 4 ? payload[4].payload.uv[0] : "";

    return (
      <Paper className={`ohm-card tooltip-container`} sx={{ minWidth: "250px" }}>
        <DataRow
          title="Time"
          balance={timestamp && timestamp === "now" ? "Now" : new Date(Number(timestamp)).toLocaleString()}
        ></DataRow>
        <Typography fontSize="15px" fontWeight={600} mt="33px">
          Price
        </Typography>
        <DataRow title="Snapshot Price" balance={formatCurrency(price ? price : currentPrice, 2, reserveSymbol)} />
        <Typography fontSize="15px" fontWeight={600} mt="33px">
          Lower Range
        </Typography>
        <DataRow title="Cushion" balance={formatCurrency(lowerCushion, 2, reserveSymbol)} />
        <DataRow title="Wall" balance={formatCurrency(lowerWall, 2, reserveSymbol)} />
        <DataRow
          title="Capacity"
          balance={`${capacityFormatter.format(parseBigNumber(rangeData.low.capacity, 18))} ${reserveSymbol} `}
        />
        <Typography fontSize="15px" fontWeight={600} mt="33px">
          Upper Range
        </Typography>
        <DataRow title="Cushion" balance={formatCurrency(upperCushion, 2, reserveSymbol)} />
        <DataRow title="Wall" balance={formatCurrency(upperWall, 2, reserveSymbol)} />
        <DataRow
          title="Capacity"
          balance={`${capacityFormatter.format(parseBigNumber(rangeData.high.capacity, 9))} OHM`}
        />
        {label === "now" && (
          <>
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
        <ComposedChart data={chartData} margin={{ right: 50 }}>
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
                Math.min(dataMin, askPrice, bidPrice, parseBigNumber(rangeData.low.wall.price, 18)) * 0.95,
              (dataMax: number) =>
                Math.max(dataMax, askPrice, bidPrice, parseBigNumber(rangeData.low.wall.price, 18)) * 1.05,
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
            y={chartData.length > 1 ? chartData[0].price : 0}
            shape={CustomReferenceDot}
            fill={theme.colors.gray[10]}
          >
            <Label
              className={classes.currentPrice}
              position={(isSquishyBid && bidPriceDelta < 0) || (isSquishyAsk && askPriceDelta < 0) ? "bottom" : "top"}
            >
              {formatCurrency(chartData.length > 1 ? chartData[0].price : 0, 2, reserveSymbol)}
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
