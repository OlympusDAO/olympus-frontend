import "./ChooseBond.scss";

import { t } from "@lingui/macro";
import { Box, Tab, Tabs, Zoom } from "@material-ui/core";
import { MetricCollection, Paper } from "@olympusdao/component-library";
import { useState } from "react";

import { BondList } from "../Bond/components/BondList";
import { ClaimBonds } from "../Bond/components/ClaimBonds/ClaimBonds";
import { useBonds } from "../Bond/hooks/useBonds";
import { OHMPrice, TreasuryBalance } from "../TreasuryDashboard/components/Metric/Metric";

function ChooseBondV2() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentAction, setCurrentAction] = useState<"BOND" | "INVERSE">("BOND");

  const bonds = useBonds().data;
  const inverse = useBonds({ isInverseBond: true }).data;
  const showTabs = !!inverse && inverse.length > 0 && !!bonds;

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <ClaimBonds />

      <Zoom in onEntered={() => setIsZoomed(true)}>
        <Paper headerText={currentAction === "INVERSE" ? `${t`Inverse Bond`} (3,1)` : `${t`Bond`} (4,4)`}>
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
                onChange={(_, view) => setCurrentAction(view === 0 ? "BOND" : "INVERSE")}
                // Hides the tab underline while <Zoom> is zooming
                TabIndicatorProps={!isZoomed ? { style: { display: "none" } } : undefined}
              >
                <Tab aria-label="bond-button" label={t`Bond`} />
                <Tab aria-label="inverse-bond-button" label={t`Inverse Bond`} />
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
      </Zoom>
    </Box>
  );
}

export default ChooseBondV2;
