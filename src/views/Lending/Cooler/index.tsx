import { Box, Tab, Tabs } from "@mui/material";
import { useMemo, useState } from "react";
import PageTitle from "src/components/PageTitle";
import { CoolerDashboard } from "src/views/Lending/Cooler/dashboard/Dashboard";
import { useCoolerSnapshotLatest } from "src/views/Lending/Cooler/hooks/useSnapshot";
import { CoolerPositions } from "src/views/Lending/Cooler/Positions";
import { LiquidityCTA } from "src/views/Liquidity/LiquidityCTA";

export const Cooler = () => {
  const { latestSnapshot } = useCoolerSnapshotLatest();

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
