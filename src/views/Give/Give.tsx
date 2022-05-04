import "./Give.scss";

import { t } from "@lingui/macro";
import { Grid, Link, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Paper, Tab, TabPanel, Tabs } from "@olympusdao/component-library";
import { useState } from "react";
import { Outlet, Route, Routes } from "react-router";
import { NavLink as RouterLink } from "react-router-dom";
import { isSupportedChain } from "src/helpers/GiveHelpers";
import { useV1RedeemableBalance } from "src/hooks/useGiveInfo";
import { useWeb3Context } from "src/hooks/web3Context";
import { ChangeAssetType } from "src/slices/interfaces";

import { CallToRedeem } from "./CallToRedeem";
import CausesDashboard from "./CausesDashboard";
import { GiveInfo } from "./GiveInfo";
import { GohmToggle } from "./GohmToggle";
import GrantInfo from "./GrantInfo";
import GrantsDashboard from "./GrantsDashboard";
import ProjectInfo from "./ProjectInfo";
import RedeemYield from "./RedeemYield";
import YieldRecipients from "./YieldRecipients";

function Give({ selectedIndex = 0 }) {
  const [giveAssetType, setGiveAssetType] = useState<"sOHM" | "gOHM">("sOHM");

  const { address, networkId } = useWeb3Context();

  const v1RedeemableBalance = useV1RedeemableBalance(address);
  const hasV1Assets = v1RedeemableBalance.data && v1RedeemableBalance.data != "0.0";

  const theme = useTheme();
  const isBreakpointXS = useMediaQuery(theme.breakpoints.down("xs"));

  const changeGiveAssetType: ChangeAssetType = (checked: boolean) => {
    setGiveAssetType(checked ? "gOHM" : "sOHM");
  };

  const CausesTab = () => (
    <TabPanel value={0} index={0}>
      <GohmToggle giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />
      <CausesDashboard giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />
    </TabPanel>
  );

  const GrantsTab = () => (
    <TabPanel value={1} index={1}>
      <GohmToggle giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />
      <GrantsDashboard giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />
    </TabPanel>
  );

  const YieldRecipientsTab = () => (
    <TabPanel value={2} index={2}>
      {/* We have a button to switch tabs in this child component, so need to pass the handler. */}
      <YieldRecipients giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />
    </TabPanel>
  );

  const RedeemYieldTab = () => (
    <TabPanel value={3} index={3}>
      <RedeemYield />
    </TabPanel>
  );

  const PageWrapper = () => (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12} sm={10} md={10} lg={8}>
        <Paper headerText={t`Give`} childPaperBackground={true} fullWidth className="no-container-padding" zoom={false}>
          {!isSupportedChain(networkId) ? (
            <Typography variant="h6">
              Note: You are currently using an unsupported network. Please switch to Ethereum to experience the full
              functionality.
            </Typography>
          ) : (
            <></>
          )}
          {hasV1Assets && <CallToRedeem />}
          <Tabs
            centered
            value={selectedIndex}
            className={`give-tab-buttons ${isBreakpointXS ? `give-tab-buttons-xs` : ``}`}
            aria-label="stake tabs"
            TabIndicatorProps={{ style: { display: "none" } }}
          >
            <Link to="/give" component={RouterLink} end>
              <Tab label={t`Causes`} />
            </Link>
            <Link to="/give/grants" component={RouterLink}>
              <Tab label={t`Grants`} />
            </Link>
            <Link to="/give/donations" component={RouterLink}>
              <Tab label={t`My Donations`} />
            </Link>
            <Link to="/give/redeem" component={RouterLink}>
              <Tab label={t`Redeem`} />
            </Link>
          </Tabs>
          <Outlet />
        </Paper>
        <GiveInfo />
      </Grid>
    </Grid>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<PageWrapper />}>
          <Route index element={<CausesTab />} />
          <Route path="grants" element={<GrantsTab />} />
          <Route path="donations" element={<YieldRecipientsTab />} />
          <Route path="redeem" element={<RedeemYieldTab />} />
        </Route>
        <Route
          path="/projects/:slug"
          element={<ProjectInfo giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />}
        />
        <Route
          path="/grants/:slug"
          element={<GrantInfo giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />}
        />
      </Routes>
    </>
  );
}

export default Give;
