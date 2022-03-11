import "./ChooseBond.scss";

import { t } from "@lingui/macro";
import { Zoom } from "@material-ui/core";
import { Metric, MetricCollection, Paper, Tab, Tabs } from "@olympusdao/component-library";
import isEmpty from "lodash/isEmpty";
import { ChangeEvent, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { formatCurrency } from "src/helpers";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { IUserNote } from "src/slices/BondSliceV2";

import ChooseStraightBond from "./ChooseStraightBond";
import ClaimBonds from "./ClaimBonds";
import ChooseInverseBond from "./InverseBond/ChooseInverseBond";

function ChooseBondV2() {
  const { networkId } = useWeb3Context();
  const history = useHistory();
  usePathForNetwork({ pathName: "bonds", networkID: networkId, history });

  const accountNotes: IUserNote[] = useAppSelector(state => state.bondingV2.notes);

  const marketPrice: number | undefined = useAppSelector(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useAppSelector(state => state.app.treasuryMarketValue);

  const formattedTreasuryBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(treasuryBalance));

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

  const [currentAction, setCurrentAction] = useState<number>(0);
  const [showTabs, setShowTabs] = useState<boolean>(false);
  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setCurrentAction(newView);
  };
  return (
    <div id="choose-bond-view">
      {(!isEmpty(accountNotes) || !isEmpty(v1AccountBonds)) && <ClaimBonds activeNotes={accountNotes} />}
      {/* standard bonds for desktop, mobile is below */}
      <Zoom in={true}>
        <Paper headerText={currentAction === 1 ? `${t`Inverse Bond`} (3,1)` : `${t`Bond`} (4,4)`}>
          <MetricCollection>
            <Metric
              label={t`Treasury Balance`}
              metric={formattedTreasuryBalance}
              isLoading={!!treasuryBalance ? false : true}
            />
            <Metric
              label={t`OHM Price`}
              metric={formatCurrency(Number(marketPrice), 2)}
              isLoading={marketPrice ? false : true}
            />
          </MetricCollection>

          {showTabs && (
            <Tabs
              centered
              textColor="primary"
              aria-label="bond tabs"
              indicatorColor="primary"
              key={`true`}
              className="bond-tab-container"
              value={currentAction}
              //hides the tab underline sliding animation in while <Zoom> is loading
              TabIndicatorProps={!true ? { style: { display: "none" } } : undefined}
              onChange={changeView}
            >
              <Tab aria-label="bond-button" label={t`Bond`} className="bond-tab-button" />

              <Tab aria-label="inverse-bond-button" label={t`Inverse Bond`} className="bond-tab-button" />
            </Tabs>
          )}
          {showTabs && currentAction === 1 ? <ChooseInverseBond /> : <ChooseStraightBond />}
        </Paper>
      </Zoom>
    </div>
  );
}

export default ChooseBondV2;
