import { Box, Skeleton, Tab, Tabs } from "@mui/material";
import { Metric } from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import PageTitle from "src/components/PageTitle";
import { formatCurrency } from "src/helpers";
import { CoolerDashboard } from "src/views/Lending/Cooler/dashboard/Dashboard";
import { useClearinghouseLatest } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { CoolerPositions } from "src/views/Lending/Cooler/Positions";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";

export const Cooler = () => {
  const { latestSnapshot } = useClearinghouseLatest();

  const [clearinghouseCapacity, setClearinghouseCapacity] = useState<number>();
  useMemo(() => {
    if (!latestSnapshot) {
      setClearinghouseCapacity(undefined);
      return;
    }

    const daiBalance = latestSnapshot.clearinghouse?.daiBalance || 0;
    const sDaiInDaiBalance = latestSnapshot.clearinghouse?.sDaiInDaiBalance || 0;

    setClearinghouseCapacity(daiBalance + sDaiInDaiBalance);
  }, [latestSnapshot]);

  const [clearinghouseReceivables, setClearinghouseReceivables] = useState<number>();
  useMemo(() => {
    if (!latestSnapshot) {
      setClearinghouseReceivables(undefined);
      return;
    }

    const principalReceivables = latestSnapshot.principalReceivables || 0;
    const interestReceivables = latestSnapshot.interestReceivables || 0;

    setClearinghouseReceivables(principalReceivables + interestReceivables);
  }, [latestSnapshot]);

  const [interestRate, setInterestRate] = useState<number>();
  useMemo(() => {
    if (!latestSnapshot || !latestSnapshot.terms?.interestRate) {
      setInterestRate(undefined);
      return;
    }

    // Stored as 0.005 (0.5%)
    // Multiply by 100 to get 0.5
    setInterestRate(latestSnapshot.terms.interestRate * 100);
  }, [latestSnapshot]);

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
              metric={clearinghouseCapacity ? formatCurrency(clearinghouseCapacity, 0, "DAI") : <Skeleton />}
            />
            <Metric label="Borrow Rate" metric={interestRate ? `${interestRate}%` : <Skeleton />} />
            <Metric
              label="Total Borrowed"
              metric={clearinghouseReceivables ? formatCurrency(clearinghouseReceivables, 0, "DAI") : <Skeleton />}
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
