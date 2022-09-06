import { t } from "@lingui/macro";
import { Box, Tab, Tabs } from "@mui/material";
import { MetricCollection, Paper } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { BondList } from "src/views/Bond/components/BondList";
import { BondModalContainer } from "src/views/Bond/components/BondModal/BondModal";
import { ClaimBonds } from "src/views/Bond/components/ClaimBonds/ClaimBonds";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";
import { OHMPrice, TreasuryBalance } from "src/views/TreasuryDashboard/components/Metric/Metric";

export const Bond = () => {
  const [isZoomed] = useState(false);
  const [currentAction, setCurrentAction] = useState<"BOND" | "INVERSE">("BOND");

  const navigate = useNavigate();

  const liveBonds = useLiveBonds();
  const bonds = liveBonds.data;
  const inverse = useLiveBonds({ isInverseBond: true }).data;
  const showTabs = !!inverse && inverse.length > 0 && !!bonds;

  /**
   * Updates the currently selected tab and navigation/history.
   *
   * @param tab "BOND" or "INVERSE"
   */
  const setCurrentTab = (tab: "BOND" | "INVERSE") => {
    setCurrentAction(tab);
    navigate(`/bonds/${tab === "INVERSE" ? "inverse" : ""}`);
  };

  /**
   * Handles a tab change event from the UI
   *
   * @param _event Ignored
   * @param newValue number representing the index of the newly-selected tab
   */
  const changeTab = (_event: React.ChangeEvent<unknown>, newValue: number) => {
    setCurrentTab(newValue === 0 ? "BOND" : "INVERSE");
  };

  useEffect(() => {
    // On initial load, if there are no bonds, switch to inverse bonds
    if (liveBonds.isSuccess && liveBonds.data.length === 0) {
      console.info("There are no live bonds. Switching to inverse bonds instead.");
      setCurrentTab("INVERSE");
    }
  }, [liveBonds.isSuccess, liveBonds.data]);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <ClaimBonds />
        <Paper>
          <MetricCollection>
            <TreasuryBalance />
            <OHMPrice />
          </MetricCollection>

          <Box mt="24px">
            {showTabs && (
              <Tabs
                centered
                textColor="primary"
                aria-label="bond tabs"
                indicatorColor="primary"
                value={currentAction === "BOND" ? 0 : 1}
                onChange={changeTab}
                // Hides the tab underline while <Zoom> is zooming
                TabIndicatorProps={!isZoomed ? { style: { display: "none" } } : undefined}
              >
                <Tab
                  data-testid="bond-tab"
                  aria-label="bond-button"
                  label={t({ message: "Bond", comment: "Bonding tab" })}
                />
                <Tab data-testid="inverse-bond-tab" aria-label="inverse-bond-button" label={t`Inverse Bond`} />
              </Tabs>
            )}

            {!!bonds && !!inverse && (
              <Box mt="24px">
                <BondList
                  isInverseBond={currentAction === "INVERSE"}
                  bonds={currentAction === "BOND" ? bonds : inverse}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
      <Routes>
        <Route path=":id" element={<BondModalContainer />} />
        <Route path="inverse/:id" element={<BondModalContainer />} />
      </Routes>
    </>
  );
};
