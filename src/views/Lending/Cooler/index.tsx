import { ArrowBack } from "@mui/icons-material";
import { Box, Link, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { CoolerDashboard } from "src/views/Lending/Cooler/dashboard/Dashboard";
import { CoolerPositions } from "src/views/Lending/Cooler/positions/Positions";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";

export const Cooler = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

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
          <Tab label="Positions" />
          <Tab label="Metrics" />
        </Tabs>

        {tabIndex === 0 && <CoolerPositions />}
        {tabIndex === 1 && <CoolerDashboard />}

        <LiquidityCTA />
      </Box>
    </div>
  );
};
