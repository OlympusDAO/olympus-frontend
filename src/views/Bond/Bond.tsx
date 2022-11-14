import { t } from "@lingui/macro";
import { Box, Tab, Tabs } from "@mui/material";
import { MetricCollection, Paper } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getSubgraphUrls } from "src/helpers/SubgraphUrlHelper";
import { BondList } from "src/views/Bond/components/BondList";
import { BondModalContainer } from "src/views/Bond/components/BondModal/BondModal";
import { BondModalContainerV3 } from "src/views/Bond/components/BondModal/BondModalContainerV3";
import { ClaimBonds } from "src/views/Bond/components/ClaimBonds/ClaimBonds";
import { ClaimBondsV3 } from "src/views/Bond/components/ClaimBonds/ClaimBondsV3";
import { useLiveBonds, useLiveBondsV3 } from "src/views/Bond/hooks/useLiveBonds";
import {
  AbstractedMetricProps,
  MetricSubgraphProps,
  OHMPrice,
  TreasuryBalance,
} from "src/views/TreasuryDashboard/components/Metric/Metric";

export const Bond = () => {
  const [isZoomed] = useState(false);
  const [currentAction, setCurrentAction] = useState<"BOND" | "INVERSE">("BOND");

  const subgraphUrls = getSubgraphUrls();
  const sharedMetricProps: AbstractedMetricProps & MetricSubgraphProps = {
    subgraphUrls: subgraphUrls,
  };

  const navigate = useNavigate();

  const { data: liveBondsV2 = [], isSuccess: liveBondsV2Sucess } = useLiveBonds();
  const { data: liveBondsV3 = [], isSuccess: liveBondsV3Sucess } = useLiveBondsV3();
  const { data: inverseV2 = [] } = useLiveBonds({ isInverseBond: true });
  const { data: inverseV3 = [] } = useLiveBondsV3({ isInverseBond: true });

  const bonds = liveBondsV2.concat(liveBondsV3);
  const inverse = inverseV2.concat(inverseV3);

  const showTabs = !!inverse && inverse.length > 0 && !!bonds && bonds.length > 0;

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
    if (liveBondsV2Sucess && liveBondsV3Sucess && bonds.length === 0) {
      console.info("There are no live bonds. Switching to inverse bonds instead.");
      setCurrentTab("INVERSE");
    }
  }, [liveBondsV2Sucess, liveBondsV3Sucess]);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <ClaimBonds />
        <ClaimBondsV3 />
        <Paper headerText={currentAction === "INVERSE" ? `${t`Inverse Bond`} (3,1)` : `${t`Bond`} (4,4)`}>
          <MetricCollection>
            <TreasuryBalance {...sharedMetricProps} />
            <OHMPrice {...sharedMetricProps} />
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
                  style={{ fontSize: "1rem" }}
                />
                <Tab
                  data-testid="inverse-bond-tab"
                  aria-label="inverse-bond-button"
                  label={t`Inverse Bond`}
                  style={{ fontSize: "1rem" }}
                />
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
        <Route path="v3/:id" element={<BondModalContainerV3 />} />
        <Route path="v3/inverse/:id" element={<BondModalContainerV3 />} />
        <Route path=":id" element={<BondModalContainer />} />
        <Route path="inverse/:id" element={<BondModalContainer />} />
      </Routes>
    </>
  );
};
