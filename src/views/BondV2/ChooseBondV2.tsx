import "./ChooseBond.scss";

import { t } from "@lingui/macro";
import { Box, Tab, Tabs, Typography, Zoom } from "@material-ui/core";
import { MetricCollection, Paper } from "@olympusdao/component-library";
import isEmpty from "lodash/isEmpty";
import { Suspense, useEffect, useState } from "react";
import { useAppSelector } from "src/hooks";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { IUserNote } from "src/slices/BondSliceV2";

import { BondInfoText } from "../Bond/components/BondInfoText";
import { BondList } from "../Bond/components/BondList/BondList";
import { OHMPrice, TreasuryBalance } from "../TreasuryDashboard/components/Metric/Metric";
import ClaimBonds from "./ClaimBonds";

function ChooseBondV2() {
  const [showTabs, setShowTabs] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentAction, setCurrentAction] = useState(0);

  const accountNotes: IUserNote[] = useAppSelector(state => state.bondingV2.notes);

  const v1AccountBonds: IUserBondDetails[] = useAppSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const inverseBonds = useAppSelector(state => {
    return state.inverseBonds.indexes
      .map(index => state.inverseBonds.bonds[index])
      .sort((a, b) => b.discount - a.discount);
  });

  useEffect(() => {
    if (inverseBonds.length > 0 && currentAction === 0) {
      setShowTabs(true);
      setCurrentAction(1);
    }
  }, [inverseBonds.length]);

  return (
    <div id="choose-bond-view">
      {(!isEmpty(accountNotes) || !isEmpty(v1AccountBonds)) && <ClaimBonds activeNotes={accountNotes} />}

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

            <Suspense fallback={null}>
              <BondList />

              <Box mt="24px" className="help-text">
                <Typography variant="body2">
                  <BondInfoText isInverseBond={currentAction === 1} />
                </Typography>
              </Box>
            </Suspense>
          </Box>
        </Paper>
      </Zoom>
    </div>
  );
}

export default ChooseBondV2;
