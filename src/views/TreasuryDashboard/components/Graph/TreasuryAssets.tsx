import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { TabBar } from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { updateSearchParams } from "src/helpers/SearchParamsHelper";
import { GraphProps } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { TreasuryAssetsGraph } from "src/views/TreasuryDashboard/components/Graph/TreasuryAssetsGraph";
import { TreasuryAssetsTable } from "src/views/TreasuryDashboard/components/Graph/TreasuryAssetsTable";

const QUERY_TREASURY_MARKET_VALUE = "marketValue";
const QUERY_TREASURY_LIQUID_BACKING = "liquidBacking";
const QUERY_TREASURY = "treasuryAssets";

/**
 * Displays the market value chart and assets table together, along with a toggle
 * to choose between displaying the market value or liquid backing.
 *
 * The assets table will update according to the toggle selection.
 */
export const TreasuryAssets = ({ earliestDate, subgraphDaysOffset }: GraphProps) => {
  const isTreasuryAssetActive = (assets: string): boolean => {
    return selectedTreasuryAssets === assets;
  };

  // State variable for the selected tab
  const [selectedTreasuryAssets, setSelectedTreasuryAssets] = useState(QUERY_TREASURY_MARKET_VALUE);
  const [isLiquidBackingActive, setIsLiquidBackingActive] = useState(false);
  // Set the selected treasury assets from search parameters
  const [searchParams] = useSearchParams();
  useMemo(() => {
    // Get the record count from the URL query parameters, or use the default
    const queryTreasuryAssets = searchParams.get(QUERY_TREASURY) || QUERY_TREASURY_MARKET_VALUE;
    setSelectedTreasuryAssets(queryTreasuryAssets);
    setIsLiquidBackingActive(queryTreasuryAssets === QUERY_TREASURY_LIQUID_BACKING);
  }, [searchParams]);

  const getSearchParamsWithUpdatedTreasuryAssets = (assets: string): string => {
    return updateSearchParams(searchParams, QUERY_TREASURY, assets).toString();
  };

  // State variable for the selected index in the chart
  const [selectedIndex, setSelectedIndex] = useState(0);

  /**
   * Uses mouse movement events in the market value chart to record the
   * current index that the user is hovering over. This is then passed to
   * the assets table in order to have the contents reflect the current
   * index (date).
   *
   * @param nextState
   * @param event
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onMouseMove: CategoricalChartFunc = (nextState, event) => {
    // We need to explictly check for undefined, otherwise an index of 0 will be caught (OlympusDAO/olympus-frontend#2128)
    if (nextState.activeTooltipIndex === undefined) return;

    setSelectedIndex(nextState.activeTooltipIndex);
  };

  return (
    <>
      <Grid container paddingBottom={2}>
        <Grid item xs={12}>
          {/* The TabBar is designed to work with a flexbox so that it contracts & expands as necessary.
              With a Grid component, the width is more fixed, which leads to rendering issues. */}
          <Box display="flex" flexDirection="row" justifyContent="center">
            <TabBar
              disableRouting
              items={[
                {
                  label: `Market Value`,
                  to: `/dashboard?${getSearchParamsWithUpdatedTreasuryAssets(QUERY_TREASURY_MARKET_VALUE)}`,
                  isActive: isTreasuryAssetActive(QUERY_TREASURY_MARKET_VALUE),
                },
                {
                  label: `Liquid Backing`,
                  to: `/dashboard?${getSearchParamsWithUpdatedTreasuryAssets(QUERY_TREASURY_LIQUID_BACKING)}`,
                  isActive: isTreasuryAssetActive(QUERY_TREASURY_LIQUID_BACKING),
                },
              ]}
            />
          </Box>
        </Grid>
      </Grid>
      <TreasuryAssetsGraph
        isLiquidBackingActive={isLiquidBackingActive}
        onMouseMove={onMouseMove}
        earliestDate={earliestDate}
        subgraphDaysOffset={subgraphDaysOffset}
      />
      <TreasuryAssetsTable
        earliestDate={earliestDate}
        isLiquidBackingActive={isLiquidBackingActive}
        selectedIndex={selectedIndex}
        subgraphDaysOffset={subgraphDaysOffset}
      />
    </>
  );
};
