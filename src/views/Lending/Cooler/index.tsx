import { Box, Skeleton, Tab, Tabs } from "@mui/material";
import { Metric } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import PageTitle from "src/components/PageTitle";
import { formatCurrency } from "src/helpers";
import { CoolerDashboard } from "src/views/Lending/Cooler/dashboard/Dashboard";
import { CoolerPositions } from "src/views/Lending/Cooler/Positions";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";

export const Cooler = () => {
  // TODO replace with hook
  const clearingHouse = {
    interestRate: 0.5,
    capacity: BigNumber.from(17999999).mul(BigNumber.from(10).pow(18)),
    receivables: BigNumber.from(10000000).mul(BigNumber.from(10).pow(18)),
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
              label="Available Borrow Capacity"
              metric={
                clearingHouse?.capacity ? (
                  formatCurrency(Number(ethers.utils.formatUnits(clearingHouse?.capacity || "0")), 0, "DAI")
                ) : (
                  <Skeleton />
                )
              }
            />
            <Metric
              label="Borrow Rate"
              metric={clearingHouse?.interestRate ? `${clearingHouse.interestRate}%` : <Skeleton />}
            />
            <Metric
              label="Total Borrowed"
              metric={
                clearingHouse?.receivables ? (
                  formatCurrency(Number(ethers.utils.formatUnits(clearingHouse?.receivables || "0")), 0, "DAI")
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
        {tabIndex === 1 && <CoolerDashboard />}

        <LiquidityCTA />
      </Box>
    </div>
  );
};
