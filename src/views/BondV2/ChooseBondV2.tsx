import "./ChooseBond.scss";

import { t } from "@lingui/macro";
import { Box, Tab, Tabs, Zoom } from "@material-ui/core";
import { MetricCollection, Paper } from "@olympusdao/component-library";
import { useState } from "react";

import { BondList } from "../Bond/components/BondList/BondList";
import { ClaimBonds } from "../Bond/components/ClaimBonds/ClaimBonds";
import { OHMPrice, TreasuryBalance } from "../TreasuryDashboard/components/Metric/Metric";

function ChooseBondV2() {
  const [showTabs, setShowTabs] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentAction, setCurrentAction] = useState(0);

  return (
    <div id="choose-bond-view">
      <ClaimBonds />

      <Zoom in onEntered={() => setIsZoomed(true)}>
        <Paper headerText={currentAction === 1 ? `${t`Inverse Bond`} (3,1)` : `${t`Bond`} (4,4)`}>
          <MetricCollection>
            <TreasuryBalance />
            <OHMPrice />
          </MetricCollection>

          <Box mt="24px">
            {showTabs && (
              <Tabs
                centered
                textColor="primary"
                value={currentAction}
                aria-label="bond tabs"
                indicatorColor="primary"
                className="bond-tab-container"
                onChange={(_, view) => setCurrentAction(view)}
                // Hides the tab underline while <Zoom> is zooming
                TabIndicatorProps={!isZoomed ? { style: { display: "none" } } : undefined}
              >
                <Tab aria-label="bond-button" label={t`Bond`} className="bond-tab-button" />
                <Tab aria-label="inverse-bond-button" label={t`Inverse Bond`} className="bond-tab-button" />
              </Tabs>
            )}

            <BondList isInverseBond={false} />
          </Box>
        </Paper>
      </Zoom>
    </div>
  );
}

export default ChooseBondV2;
