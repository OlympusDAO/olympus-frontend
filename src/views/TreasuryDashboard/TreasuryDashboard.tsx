import { useEffect, useState } from "react";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Theme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import Chart from "../../components/Chart/Chart.jsx";
import { trim, formatCurrency } from "../../helpers";
import {
  treasuryDataQuery,
  rebasesDataQuery,
  bulletpoints,
  tooltipItems,
  tooltipInfoMessages,
  itemType,
} from "./treasuryData";
import { useTheme } from "@material-ui/core/styles";
import "./treasury-dashboard.scss";
import apollo from "../../lib/apolloClient";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";
import { useAppSelector } from "src/hooks/index";

interface ITreasuryData {
  readonly id: string;
  readonly timestamp: string;
  readonly ohmCirculatingSupply: string;
  readonly sOhmCirculatingSupply: string;
  readonly totalSupply: string;
  readonly ohmPrice: string;
  readonly marketCap: string;
  readonly totalValueLocked: string;
  readonly treasuryRiskFreeValue: string;
  readonly treasuryMarketValue: string;
  readonly nextEpochRebase: string;
  readonly nextDistributedOhm: string;
  readonly treasuryDaiRiskFreeValue: string;
  readonly treasuryFraxMarketValue: string;
  readonly treasuryDaiMarketValue: string;
  readonly treasuryFraxRiskFreeValue: string;
  readonly treasuryXsushiMarketValue: string;
  readonly treasuryWETHMarketValue: string;
  readonly currentAPY: string;
  readonly runway10k: string;
  readonly runway20k: string;
  readonly runway50k: string;
  readonly runwayCurrent: string;
  readonly holders: string;
  readonly treasuryOhmDaiPOL: string;
  readonly treasuryOhmFraxPOL: string;
}

interface ITheme {
  readonly palette: {
    readonly color: string;
    readonly gold: string;
    readonly gray: string;
    readonly textHighlightColor: string;
    readonly backgroundColor: string;
    readonly paperBg: string;
    readonly modalBg: string;
    readonly popoverBg: string;
    readonly menuBg: string;
    readonly backdropBg: string;
    readonly largeTextColor: string;
    readonly activeLinkColor: string;
    readonly primaryButtonColor: string;
    readonly primaryButtonBG: string;
    readonly primaryButtonHoverBG: string;
    readonly secondaryButtonHoverBG: string;
    readonly outlinedPrimaryButtonHoverBG: string;
    readonly outlinedPrimaryButtonHoverColor: string;
    readonly outlinedSecondaryButtonHoverBG: string;
    readonly outlinedSecondaryButtonHoverColor: string;
    readonly containedSecondaryButtonHoverBG: string;
    readonly graphStrokeColor: string;
  };
}

interface IRebasesData {
  readonly percentage: string;
  readonly timestamp: string;
}

function TreasuryDashboard() {
  const [data, setData] = useState<{ [key: string]: number }[]>([]);
  const [apy, setApy] = useState<
    {
      apy: number;
      timestamp: string;
    }[]
  >([]);
  const [runway, setRunway] = useState<{ [key: string]: number }[]>([]);
  const [staked, setStaked] = useState<
    {
      staked: number;
      timestamp: string;
    }[]
  >([]);
  const theme = useTheme<ITheme & Theme>();
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const marketPrice = useAppSelector(state => {
    return state.app.marketPrice || 0;
  });
  const circSupply = useAppSelector(state => {
    return state.app.circSupply || 0;
  });
  const totalSupply = useAppSelector(state => {
    return state.app.totalSupply || 0;
  });
  const marketCap = useAppSelector(state => {
    return state.app.marketCap || 0;
  });

  const currentIndex = useAppSelector(state => {
    return state.app.currentIndex || "";
  });

  const backingPerOhm = useAppSelector(state => {
    return !state.app.treasuryMarketValue || !state.app.circSupply
      ? 0
      : state.app.treasuryMarketValue / state.app.circSupply;
  });

  const wsOhmPrice = useAppSelector(state => {
    return !state.app.marketPrice || !state.app.currentIndex
      ? 0
      : state.app.marketPrice * Number(state.app.currentIndex);
  });

  useEffect(() => {
    (async () => {
      const treasuryData = await apollo<{ protocolMetrics: ITreasuryData[] }>(treasuryDataQuery);
      if (treasuryData) {
        let metrics = treasuryData.data.protocolMetrics.map(entry =>
          Object.entries(entry).reduce(
            (obj, [key, value]) => ((obj[key] = parseFloat(value)), obj),
            {} as { [key: string]: number },
          ),
        );
        metrics = metrics.filter(pm => pm.treasuryMarketValue > 0);
        setData(metrics);

        let staked = treasuryData.data.protocolMetrics.map(entry => ({
          staked: (parseFloat(entry.sOhmCirculatingSupply) / parseFloat(entry.ohmCirculatingSupply)) * 100,
          timestamp: entry.timestamp,
        }));
        staked = staked.filter(pm => pm.staked < 100);
        setStaked(staked);

        let runway = metrics.filter(pm => pm.runway10k > 5);
        setRunway(runway);
      }

      const rebasesData = await apollo<{ rebases: IRebasesData[] }>(rebasesDataQuery);
      if (rebasesData) {
        let apy = rebasesData.data.rebases.map(entry => ({
          apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
          timestamp: entry.timestamp,
        }));

        apy = apy.filter(pm => pm.apy < 300000);

        setApy(apy);
      }
    })();
  }, []);

  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Box className={`hero-metrics`}>
          <Paper className="ohm-card">
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              <Box className="metric market">
                <Typography variant="h6" color="textSecondary">
                  Market Cap
                </Typography>
                <Typography variant="h5">
                  {marketCap && formatCurrency(marketCap, 0)}
                  {!marketCap && <Skeleton variant="text" />}
                </Typography>
              </Box>

              <Box className="metric price">
                <Typography variant="h6" color="textSecondary">
                  OHM Price
                </Typography>
                <Typography variant="h5">
                  {/* appleseed-fix */}
                  {marketPrice ? formatCurrency(marketPrice, 2) : <Skeleton variant="text" />}
                </Typography>
              </Box>

              <Box className="metric wsoprice">
                <Typography variant="h6" color="textSecondary">
                  wsOHM Price
                  <InfoTooltip
                    message={
                      "wsOHM = sOHM * index\n\nThe price of wsOHM is equal to the price of OHM multiplied by the current index"
                    }
                  />
                </Typography>

                <Typography variant="h5">
                  {wsOhmPrice ? formatCurrency(wsOhmPrice, 2) : <Skeleton variant="text" />}
                </Typography>
              </Box>

              <Box className="metric circ">
                <Typography variant="h6" color="textSecondary">
                  Circulating Supply (total)
                </Typography>
                <Typography variant="h5">
                  {circSupply && totalSupply ? (
                    parseInt(circSupply.toString()) + " / " + parseInt(totalSupply.toString())
                  ) : (
                    <Skeleton variant="text" />
                  )}
                </Typography>
              </Box>

              <Box className="metric bpo">
                <Typography variant="h6" color="textSecondary">
                  Backing per OHM
                </Typography>
                <Typography variant="h5">
                  {backingPerOhm ? formatCurrency(backingPerOhm, 2) : <Skeleton variant="text" />}
                </Typography>
              </Box>

              <Box className="metric index">
                <Typography variant="h6" color="textSecondary">
                  Current Index
                  <InfoTooltip
                    message={
                      "The current index tracks the amount of sOHM accumulated since the beginning of staking. Basically, how much sOHM one would have if they staked and held a single OHM from day 1."
                    }
                  />
                </Typography>
                <Typography variant="h5">
                  {currentIndex ? trim(Number(currentIndex), 2) + " sOHM" : <Skeleton variant="text" />}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Zoom in={true}>
          <Grid container spacing={2} className="data-grid">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <Chart
                  type="area"
                  data={data}
                  dataKey={["totalValueLocked"]}
                  stopColor={[["#768299", "#98B3E9"]]}
                  headerText="Total Value Deposited"
                  headerSubText={`${data.length > 0 && formatCurrency(data[0].totalValueLocked)}`}
                  bulletpointColors={bulletpoints.tvl}
                  itemNames={tooltipItems.tvl}
                  itemType={itemType.dollar}
                  infoTooltipMessage={tooltipInfoMessages.tvl}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  // TS-REFACTOR-TODO (0xdavinchee): I can somewhat guess what these are supposed to be, but in the spirit of
                  // how we are approaching the refactor, I will simply set these as undefined (as they were)
                  // previously
                  scale={undefined}
                  color={undefined}
                  stroke={undefined}
                  dataFormat={undefined}
                  isPOL={undefined}
                  isStaked={undefined}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <Chart
                  type="stack"
                  data={data}
                  dataKey={[
                    "treasuryDaiMarketValue",
                    "treasuryFraxMarketValue",
                    "treasuryWETHMarketValue",
                    "treasuryXsushiMarketValue",
                  ]}
                  stopColor={[
                    ["#F5AC37", "#EA9276"],
                    ["#768299", "#98B3E9"],
                    ["#DC30EB", "#EA98F1"],
                    ["#8BFF4D", "#4C8C2A"],
                  ]}
                  headerText="Market Value of Treasury Assets"
                  headerSubText={`${data.length > 0 && formatCurrency(data[0].treasuryMarketValue)}`}
                  bulletpointColors={bulletpoints.coin}
                  itemNames={tooltipItems.coin}
                  itemType={itemType.dollar}
                  infoTooltipMessage={tooltipInfoMessages.mvt}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  // TS-REFACTOR-TODO (0xdavinchee): I can somewhat guess what these are supposed to be, but in the spirit of
                  // how we are approaching the refactor, I will simply set these as undefined (as they were)
                  // previously
                  scale={undefined}
                  color={undefined}
                  stroke={undefined}
                  dataFormat={undefined}
                  isPOL={undefined}
                  isStaked={undefined}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <Chart
                  type="stack"
                  data={data}
                  dataFormat="currency"
                  dataKey={["treasuryDaiRiskFreeValue", "treasuryFraxRiskFreeValue"]}
                  stopColor={[
                    ["#F5AC37", "#EA9276"],
                    ["#768299", "#98B3E9"],
                    ["#000", "#fff"],
                    ["#000", "#fff"],
                  ]}
                  headerText="Risk Free Value of Treasury Assets"
                  headerSubText={`${data.length > 0 && formatCurrency(data[0].treasuryRiskFreeValue)}`}
                  bulletpointColors={bulletpoints.coin}
                  itemNames={tooltipItems.coin}
                  itemType={itemType.dollar}
                  infoTooltipMessage={tooltipInfoMessages.rfv}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  // TS-REFACTOR-TODO (0xdavinchee): I can somewhat guess what these are supposed to be, but in the spirit of
                  // how we are approaching the refactor, I will simply set these as undefined (as they were)
                  // previously
                  scale={undefined}
                  color={undefined}
                  stroke={undefined}
                  isPOL={undefined}
                  isStaked={undefined}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="area"
                  data={data}
                  dataKey={["treasuryOhmDaiPOL"]}
                  stopColor={[["rgba(128, 204, 131, 1)", "rgba(128, 204, 131, 0)"]]}
                  headerText="Protocol Owned Liquidity OHM-DAI"
                  headerSubText={`${data.length > 0 && trim(data[0].treasuryOhmDaiPOL, 2)}% `}
                  dataFormat="percent"
                  bulletpointColors={bulletpoints.pol}
                  itemNames={tooltipItems.pol}
                  itemType={itemType.percentage}
                  infoTooltipMessage={tooltipInfoMessages.pol}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  // TS-REFACTOR-TODO (0xdavinchee): I can somewhat guess what these are supposed to be, but in the spirit of
                  // how we are approaching the refactor, I will simply set these as undefined (as they were)
                  // previously
                  scale={undefined}
                  color={undefined}
                  stroke={undefined}
                  isStaked={undefined}
                  isPOL={true}
                />
              </Paper>
            </Grid>
            {/*  Temporarily removed until correct data is in the graph */}
            {/* <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="bar"
                  data={data}
                  dataKey={["holders"]}
                  headerText="Holders"
                  stroke={[theme.palette.text.secondary]}
                  headerSubText={`${data.length > 0 && data[0].holders}`}
                  bulletpointColors={bulletpoints.holder}
                  itemNames={tooltipItems.holder}
                  itemType={undefined}
                  infoTooltipMessage={tooltipInfoMessages.holder}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  scale={undefined}
                  color={undefined}
                  stroke={undefined}
                  dataFormat={undefined}
                  isPOL={undefined}
                  isStaked={undefined}
                />
              </Paper>
            </Grid> */}

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="area"
                  data={staked}
                  dataKey={["staked"]}
                  stopColor={[["#55EBC7", "#47ACEB"]]}
                  headerText="OHM Staked"
                  dataFormat="percent"
                  headerSubText={`${staked.length > 0 && trim(staked[0].staked, 2)}% `}
                  isStaked={true}
                  bulletpointColors={bulletpoints.staked}
                  infoTooltipMessage={tooltipInfoMessages.staked}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  itemType={itemType.percentage}
                  // TS-REFACTOR-TODO (0xdavinchee): I can somewhat guess what these are supposed to be, but in the spirit of
                  // how we are approaching the refactor, I will simply set these as undefined (as they were)
                  // previously
                  itemNames={undefined}
                  scale={undefined}
                  color={undefined}
                  stroke={undefined}
                  isPOL={false}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="line"
                  scale="log"
                  data={apy}
                  dataKey={["apy"]}
                  color={theme.palette.text.primary}
                  stroke={[theme.palette.text.primary]}
                  headerText="APY over time"
                  dataFormat="percent"
                  headerSubText={`${apy.length > 0 && trim(apy[0].apy, 2)}%`}
                  bulletpointColors={bulletpoints.apy}
                  itemNames={tooltipItems.apy}
                  itemType={itemType.percentage}
                  infoTooltipMessage={tooltipInfoMessages.apy}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  // TS-REFACTOR-TODO (0xdavinchee): I can somewhat guess what these are supposed to be, but in the spirit of
                  // how we are approaching the refactor, I will simply set these as undefined (as they were)
                  // previously
                  isPOL={false}
                  isStaked={false}
                  stopColor={undefined}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="line"
                  data={runway}
                  dataKey={["runwayCurrent"]}
                  color={theme.palette.text.primary}
                  stroke={[theme.palette.text.primary]}
                  headerText="Runway Available"
                  headerSubText={`${data.length > 0 && trim(data[0].runwayCurrent, 1)} Days`}
                  dataFormat="days"
                  bulletpointColors={bulletpoints.runway}
                  itemNames={tooltipItems.runway}
                  itemType={undefined}
                  infoTooltipMessage={tooltipInfoMessages.runway}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  // TS-REFACTOR-TODO (0xdavinchee): I can somewhat guess what these are supposed to be, but in the spirit of
                  // how we are approaching the refactor, I will simply set these as undefined (as they were)
                  // previously
                  scale={undefined}
                  isPOL={undefined}
                  isStaked={undefined}
                  stopColor={undefined}
                />
              </Paper>
            </Grid>
          </Grid>
        </Zoom>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
