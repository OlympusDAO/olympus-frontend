import { Box, Link, Tab, Tabs } from "@mui/material";
import { Icon } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { updateSearchParams } from "src/helpers/SearchParamsHelper";
import { CoolerDashboard } from "src/views/Lending/Cooler/dashboard/Dashboard";
import { CoolerPositions } from "src/views/Lending/Cooler/positions/Positions";

const PARAM_TAB = "tab";

export const Cooler = () => {
  const [tabIndex, setTabIndex] = useState<string | undefined>(undefined);
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get(PARAM_TAB);

  // When the page loads, this causes the tab to be set to the correct value
  useEffect(() => {
    setTabIndex(queryTab === "metrics" ? "metrics" : "positions");
  }, [queryTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

  const getSearchParamsWithTab = (tabIndex: number) => {
    return updateSearchParams(searchParams, PARAM_TAB, tabIndex === 0 ? "positions" : "metrics");
  };

  return (
    <div id="stake-view">
      <PageTitle
        name="Cooler Loans"
        subtitle={
          <Box display="flex" flexDirection="row" alignItems="center" gap="4px">
            Borrow DAI against your gOHM collateral.{" "}
            <Link
              component={RouterLink}
              to="https://docs.olympusdao.finance/main/overview/cooler-loans"
              target="_blank"
              rel="noopener noreferrer"
              alignItems="center"
              display="flex"
              gap="4px"
            >
              Learn More <Icon name="arrow-up" sx={{ fontSize: "14px" }} />
            </Link>
          </Box>
        }
      />
      <Box width="97%" maxWidth="974px">
        <Tabs
          centered
          textColor="primary"
          aria-label="cooler tabs"
          indicatorColor="primary"
          className="stake-tab-buttons"
          value={tabIndex}
          onChange={handleTabChange}
          //hides the tab underline sliding animation in while <Zoom> is loading
          TabIndicatorProps={{ style: { display: "none" } }}
        >
          <Tab label="Positions" href={`#/lending/cooler?${getSearchParamsWithTab(0)}`} value="positions" />
          <Tab label="Metrics" href={`#/lending/cooler?${getSearchParamsWithTab(1)}`} value="metrics" />
        </Tabs>

        {tabIndex === "positions" && <CoolerPositions />}
        {tabIndex === "metrics" && <CoolerDashboard />}
      </Box>
    </div>
  );
};
