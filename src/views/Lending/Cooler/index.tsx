import { ArrowBack } from "@mui/icons-material";
import { Box, Link, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { updateSearchParams } from "src/helpers/SearchParamsHelper";
import { CoolerDashboard } from "src/views/Lending/Cooler/dashboard/Dashboard";
import { CoolerPositions } from "src/views/Lending/Cooler/positions/Positions";

const PARAM_TAB = "tab";

export const Cooler = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabIndex, setTabIndex] = useState(0);
  const [searchParams] = useSearchParams();

  // When the page loads, this causes the tab to be set to the correct value
  useEffect(() => {
    const queryTab = searchParams.get(PARAM_TAB);
    setTabIndex(queryTab ? (queryTab === "metrics" ? 1 : 0) : 0);
  }, [searchParams]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const getSearchParamsWithTab = (tabIndex: number) => {
    return updateSearchParams(searchParams, PARAM_TAB, tabIndex === 0 ? "positions" : "metrics");
  };

  return (
    <div id="stake-view">
      <PageTitle
        name={
          <Box display="flex" flexDirection="row" alignItems="center" mt={mobile ? "50px" : "0px"}>
            <Link component={RouterLink} to="/lending">
              <Box display="flex" flexDirection="row">
                <ArrowBack />
                <Typography fontWeight="500" marginLeft="9.5px" marginRight="18px"></Typography>
              </Box>
            </Link>
            <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
              <Typography fontSize="32px" fontWeight={500}>
                Cooler Loans
              </Typography>
            </Box>
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
          <Tab label="Positions" href={`#/lending/cooler?${getSearchParamsWithTab(0)}`} />
          <Tab label="Metrics" href={`#/lending/cooler?${getSearchParamsWithTab(1)}`} />
        </Tabs>

        {tabIndex === 0 && <CoolerPositions />}
        {tabIndex === 1 && <CoolerDashboard />}
      </Box>
    </div>
  );
};
