import "./style.scss";

import { i18n } from "@lingui/core";
import { useMediaQuery } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { MultifarmProvider } from "@multifarm/widget";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import grantData from "src/views/Give/grants.json";
import projectData from "src/views/Give/projects.json";

import CallToAction from "./components/CallToAction/CallToAction";
import Messages from "./components/Messages/Messages";
import MigrationModal from "./components/Migration/MigrationModal";
import MigrationModalSingle from "./components/Migration/MigrationModalSingle";
import NavDrawer from "./components/Sidebar/NavDrawer";
import Sidebar from "./components/Sidebar/Sidebar";
import StagingNotification from "./components/StagingNotification";
import TopBar from "./components/TopBar/TopBar";
import Wallet from "./components/TopBar/Wallet";
import { NetworkId } from "./constants";
import { shouldTriggerSafetyCheck } from "./helpers";
import { trackGAEvent } from "./helpers/analytics";
import { DecimalBigNumber } from "./helpers/DecimalBigNumber/DecimalBigNumber";
import { getMultiFarmApiKey } from "./helpers/multifarm";
import { categoryTypesConfig, strategyTypesConfig } from "./helpers/multifarm";
import { nonNullable } from "./helpers/types/nonNullable";
import { useAppSelector, useWeb3Context } from "./hooks";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
} from "./hooks/useBalance";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import { useTestableNetworks } from "./hooks/useTestableNetworks";
import useTheme from "./hooks/useTheme";
import { getMigrationAllowances, loadAccountDetails } from "./slices/AccountSlice";
import { loadAppDetails } from "./slices/AppSlice";
import { error, info } from "./slices/MessagesSlice";
import { dark as darkTheme } from "./themes/dark.js";
import { girth as gTheme } from "./themes/girth.js";
import { light as lightTheme } from "./themes/light.js";
import { multifarmDarkTheme, multifarmLightTheme } from "./themes/multifarm";
import { Bond, Give, Stake, TreasuryDashboard, V1Stake, Wrap, Zap } from "./views";
import NotFound from "./views/404/NotFound";
import { BondModalContainer } from "./views/Bond/components/BondModal/BondModal";
import GrantInfo from "./views/Give/GrantInfo";
import ProjectInfo from "./views/Give/ProjectInfo";

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 312;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  notification: {
    marginLeft: "312px",
  },
}));

const MULTIFARM_API_KEY = getMultiFarmApiKey();

function App() {
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch = useDispatch();
  const [theme, toggleTheme] = useTheme();
  const trimmedPath = location.pathname + location.hash;
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { address, connect, connectionError, hasCachedProvider, provider, connected, networkId, providerInitialized } =
    useWeb3Context();

  const [migrationModalOpen, setMigrationModalOpen] = useState(false);
  const migModalClose = () => {
    setMigrationModalOpen(false);
  };

  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const [walletChecked, setWalletChecked] = useState(false);

  const { grants } = grantData;
  const { projects } = projectData;

  async function loadDetails(whichDetails: string) {
    // NOTE (unbanksy): If you encounter the following error:
    // Unhandled Rejection (Error): call revert exception (method="balanceOf(address)", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.4.0)
    // it's because the initial provider loaded always starts with networkID=1. This causes
    // address lookup on the wrong chain which then throws the error. To properly resolve this,
    // we shouldn't be initializing to networkID=1 in web3Context without first listening for the
    // network. To actually test rinkeby, change setnetworkID equal to 4 before testing.
    const loadProvider = provider;

    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && address && connected) {
      loadAccount(loadProvider);
    }
  }

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: networkId, provider: loadProvider }));
    },
    [networkId, address],
  );

  const loadAccount = useCallback(
    loadProvider => {
      if (!providerInitialized) {
        return;
      }
      dispatch(loadAccountDetails({ networkID: networkId, provider: loadProvider, address }));
      dispatch(getMigrationAllowances({ address, provider: loadProvider, networkID: networkId }));
    },
    [networkId, address, providerInitialized],
  );

  const oldAssetsDetected = useAppSelector(state => {
    if (networkId && (networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY)) {
      return (
        state.account.balances &&
        (Number(state.account.balances.sohmV1) ||
        Number(state.account.balances.ohmV1) ||
        Number(state.account.balances.wsohm)
          ? true
          : false)
      );
    } else {
      return false;
    }
  });

  const oldAssetsEnoughToMigrate = useAppSelector(state => {
    if (!state.app.currentIndex || !state.app.marketPrice) {
      return true;
    }
    const wrappedBalance = Number(state.account.balances.wsohm) * Number(state.app.currentIndex!);
    const allAssetsBalance =
      Number(state.account.balances.sohmV1) + Number(state.account.balances.ohmV1) + wrappedBalance;
    return state.app.marketPrice * allAssetsBalance >= 10;
  });

  const hasDust = useAppSelector(state => {
    if (!state.app.currentIndex || !state.app.marketPrice) {
      return true;
    }
    const wrappedBalance = Number(state.account.balances.wsohm) * Number(state.app.currentIndex!);
    const ohmBalance = Number(state.account.balances.ohmV1);
    const sOhmbalance = Number(state.account.balances.sohmV1);
    if (ohmBalance > 0 && ohmBalance * state.app.marketPrice < 10) {
      return true;
    }
    if (sOhmbalance > 0 && sOhmbalance * state.app.marketPrice < 10) {
      return true;
    }
    if (wrappedBalance > 0 && wrappedBalance * state.app.marketPrice < 10) {
      return true;
    }
    return false;
  });

  const networks = useTestableNetworks();
  const { data: sOhmBalance = new DecimalBigNumber("0", 9) } = useSohmBalance()[networks.MAINNET];
  const { data: ohmBalance = new DecimalBigNumber("0", 9) } = useOhmBalance()[networks.MAINNET];
  const gohmBalances = useGohmBalance();
  const { data: gohmFuseBalance = new DecimalBigNumber("0", 18) } = useFuseBalance()[NetworkId.MAINNET];
  const { data: gohmTokemakBalance = new DecimalBigNumber("0", 18) } = useGohmTokemakBalance()[NetworkId.MAINNET];
  const gohmTokens = [
    gohmFuseBalance,
    gohmTokemakBalance,
    gohmBalances[networks.MAINNET].data,
    gohmBalances[NetworkId.ARBITRUM].data,
    gohmBalances[NetworkId.AVALANCHE].data,
    gohmBalances[NetworkId.POLYGON].data,
    gohmBalances[NetworkId.FANTOM].data,
    gohmBalances[NetworkId.OPTIMISM].data,
  ];
  const totalGohmBalance = gohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));
  const newAssetsDetected = Number(totalGohmBalance) || Number(sOhmBalance) || Number(ohmBalance);

  // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.
  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
        trackGAEvent({
          category: "App",
          action: "connect",
        });
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
    if (shouldTriggerSafetyCheck()) {
      dispatch(info("Safety Check: Always verify you're on app.olympusdao.finance!"));
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      if (networkId !== -1) {
        loadDetails("account");
        loadDetails("app");
      }
    }
  }, [walletChecked, networkId]);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (connected && providerInitialized) {
      loadDetails("account");
    }
  }, [connected, networkId, providerInitialized]);

  useEffect(() => {
    if (connectionError) dispatch(error(connectionError.text));
  }, [connectionError]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  const themeMode = theme === "light" ? lightTheme : theme === "dark" ? darkTheme : gTheme;

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  return (
    <ThemeProvider theme={themeMode}>
      <MultifarmProvider
        token={MULTIFARM_API_KEY}
        provider="olympus"
        lng={i18n.locale}
        themeColors={theme}
        badgePlacement="bottom"
        theme={theme === "light" ? multifarmLightTheme : multifarmDarkTheme}
        categoryTypesConfig={categoryTypesConfig}
        strategyTypesConfig={strategyTypesConfig}
      >
        <CssBaseline />
        <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
          <StagingNotification />
          <Messages />
          <TopBar theme={theme} toggleTheme={toggleTheme} handleDrawerToggle={handleDrawerToggle} />
          <nav className={classes.drawer}>
            {isSmallerScreen ? (
              <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            ) : (
              <Sidebar />
            )}
          </nav>

          <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
            {oldAssetsDetected && trimmedPath.indexOf("dashboard") === -1 && oldAssetsEnoughToMigrate && (
              <CallToAction setMigrationModalOpen={setMigrationModalOpen} />
            )}

            <Switch>
              <Route exact path="/">
                <Redirect to="/stake" />
              </Route>

              <Route path="/stake">
                {/* if newAssets or 0 assets */}
                {newAssetsDetected || (!newAssetsDetected && !oldAssetsDetected) || !oldAssetsEnoughToMigrate ? (
                  <Stake />
                ) : (
                  <V1Stake oldAssetsDetected={oldAssetsDetected} setMigrationModalOpen={setMigrationModalOpen} />
                )}
              </Route>

              <Route path="/v1-stake">
                <V1Stake oldAssetsDetected={oldAssetsDetected} setMigrationModalOpen={setMigrationModalOpen} />
              </Route>

              <Route exact path="/give">
                <Give />
              </Route>
              <Redirect from="/olympusgive" to="/give" />
              <Redirect from="/tyche" to="/give" />
              <Redirect from="/olygive" to="/give" />
              <Redirect from="/olympusdaogive" to="/give" />
              <Redirect from="/ohmgive" to="/give" />

              <Route path="/give/projects">
                {projects.map(project => {
                  return (
                    <Route exact key={project.slug} path={`/give/projects/${project.slug}`}>
                      <ProjectInfo project={project} />
                    </Route>
                  );
                })}
              </Route>

              <Route exact path="/give/grants">
                <Give selectedIndex={1} />
              </Route>

              <Route path="/give/grants">
                {grants.map(grant => {
                  return (
                    <Route exact key={grant.slug} path={`/give/grants/${grant.slug}`}>
                      <GrantInfo grant={grant} />
                    </Route>
                  );
                })}
              </Route>

              <Route exact path="/give/donations">
                <Give selectedIndex={2} />
              </Route>

              <Route exact path="/give/redeem">
                <Give selectedIndex={3} />
              </Route>

              <Route path="/wrap">
                <Route exact path={`/wrap`}>
                  <Wrap />
                </Route>
              </Route>

              <Route path="/zap">
                <Route exact path={`/zap`}>
                  <Zap />
                </Route>
              </Route>

              <Route path="/bonds">
                <Bond />

                <Route path="/bonds/:id" component={BondModalContainer} />
                <Route path="/bonds/inverse/:id" component={BondModalContainer} />
              </Route>

              <Route exact path="/dashboard">
                <TreasuryDashboard activeView={0} />
              </Route>
              <Route path="/dashboard/treasury">
                <TreasuryDashboard activeView={1} />
              </Route>
              <Route path="/dashboard/revenue">
                <TreasuryDashboard activeView={2} />
              </Route>
              <Route path="/dashboard/olympuspro">
                <TreasuryDashboard activeView={3} />
              </Route>
              <Route path="/dashboard/proteus">
                <TreasuryDashboard activeView={4} />
              </Route>

              <Route exact path="/calculator">
                <Wallet open={true} component="calculator" />
              </Route>
              <Route path={"/info/:id"}>
                <Wallet open={true} component="info" />
              </Route>
              <Route path={"/info"}>
                <Wallet open={true} component="info" />
              </Route>
              <Route path={"/utility"}>
                <Wallet open={true} component="utility" />
              </Route>
              <Route path={"/wallet/history"}>
                <Wallet open={true} component="wallet/history" />
              </Route>
              <Route path="/wallet">
                <Wallet open={true} component="wallet" />
              </Route>

              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
        {hasDust ? (
          <MigrationModalSingle open={migrationModalOpen} handleClose={migModalClose} />
        ) : (
          <MigrationModal open={migrationModalOpen} handleClose={migModalClose} />
        )}
      </MultifarmProvider>
    </ThemeProvider>
  );
}

export default App;
