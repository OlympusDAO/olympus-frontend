import { Box, Skeleton, Tab, Tabs } from "@mui/material";
import { Metric } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useState } from "react";
import PageTitle from "src/components/PageTitle";
import { formatCurrency } from "src/helpers";
import { CoolerMetrics } from "src/views/Lending/Cooler/Metrics";
import { CoolerPositions } from "src/views/Lending/Cooler/Positions";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";

export const Cooler = () => {
  // TODO replace with sugraph query
  const clearingHouse = {
    interestRate: null,
    capacity: null,
  };

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div id="stake-view">
      <PageTitle name="Cooler Loans" />
      <Box width="97%" maxWidth="974px">
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Box display="flex" flexDirection="row" width={["100%", "70%"]} mt="24px" flexWrap={"wrap"}>
            <Metric
              label="Borrow Rate"
              metric={clearingHouse?.interestRate ? `${clearingHouse.interestRate}%` : <Skeleton />}
            />
            <Metric
              label="Available Borrow Capacity"
              metric={
                clearingHouse?.capacity ? (
                  formatCurrency(Number(ethers.utils.formatUnits(clearingHouse?.capacity || "0")), 2)
                ) : (
                  <Skeleton />
                )
              }
            />
          </Box>
        </Box>

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
        {tabIndex === 1 && <CoolerMetrics />}

        <LiquidityCTA />
      </Box>
    </div>
  );
};
