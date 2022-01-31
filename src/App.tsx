// eslint-disable-next-line simple-import-sort/imports
import "./style.scss";

import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "./hooks/useTheme";
import useBonds from "./hooks/Bonds";
import { useWeb3Context, useAppSelector } from "./hooks";
import useSegmentAnalytics from "./hooks/useSegmentAnalytics";
import { segmentUA } from "./helpers/userAnalyticHelpers";
import { shouldTriggerSafetyCheck } from "./helpers";

import { calcBondDetails } from "./slices/BondSlice";
import { loadAppDetails } from "./slices/AppSlice";
import { loadAccountDetails, calculateUserBondDetails, getMigrationAllowances } from "./slices/AccountSlice";
import { getZapTokenBalances } from "./slices/ZapSlice";
import { info } from "./slices/MessagesSlice";

import {
  Stake,
  TreasuryDashboard,
  Zap,
  Wrap,
  V1Stake,
  CausesDashboard,
  DepositYield,
  RedeemYield,
  BondV2,
  ChooseBondV2,
} from "./views";
import Sidebar from "./components/Sidebar/Sidebar";
import TopBar from "./components/TopBar/TopBar";
import CallToAction from "./components/CallToAction/CallToAction";
import NavDrawer from "./components/Sidebar/NavDrawer";
import Messages from "./components/Messages/Messages";
import NotFound from "./views/404/NotFound";
import MigrationModal from "src/components/Migration/MigrationModal";
import { dark as darkTheme } from "./themes/dark.js";
import { light as lightTheme } from "./themes/light.js";
import { girth as gTheme } from "./themes/girth.js";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import ProjectInfo from "./views/Give/ProjectInfo";
import projectData from "src/views/Give/projects.json";
import { getAllBonds, getUserNotes } from "./slices/BondSliceV2";
import { NetworkId } from "./constants";
import MigrationModalSingle from "./components/Migration/MigrationModalSingle";

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 280;
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
}));

function App() {
  useSegmentAnalytics();
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch = useDispatch();
  const [theme, toggleTheme] = useTheme();
  const currentPath = location.pathname + location.hash + location.search;
  const trimmedPath = location.pathname + location.hash;
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { address, connect, hasCachedProvider, provider, connected, networkId, providerInitialized } = useWeb3Context();

  const [migrationModalOpen, setMigrationModalOpen] = useState(false);
  const migModalClose = () => {
    dispatch(loadAccountDetails({ networkID: networkId, address, provider }));
    setMigrationModalOpen(false);
  };

  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const [walletChecked, setWalletChecked] = useState(false);

  const { projects } = projectData;

  // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
  const { bonds, expiredBonds } = useBonds(networkId);

  const bondIndexes = useAppSelector(state => state.bondingV2.indexes);

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
      if (networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY) {
        bonds.map(bond => {
          // NOTE (appleseed): getBondability & getLOLability control which bonds are active in the view for Bonds V1
          // ... getClaimability is the analogue for claiming bonds
          if (bond.getBondability(networkId) || bond.getLOLability(networkId)) {
            dispatch(calcBondDetails({ bond, value: "", provider: loadProvider, networkID: networkId }));
          }
        });
        dispatch(getAllBonds({ provider: loadProvider, networkID: networkId, address }));
      }
    },
    [networkId, address],
  );

  const loadAccount = useCallback(
    loadProvider => {
      if (!providerInitialized) {
        return;
      }
      dispatch(getUserNotes({ networkID: networkId, address, provider: loadProvider }));
      dispatch(loadAccountDetails({ networkID: networkId, address, provider: loadProvider }));
      dispatch(getMigrationAllowances({ address, provider: loadProvider, networkID: networkId }));
      bonds.map(bond => {
        // NOTE: get any Claimable bonds, they may not be bondable
        if (bond.getClaimability(networkId)) {
          dispatch(calculateUserBondDetails({ address, bond, provider: loadProvider, networkID: networkId }));
        }
      });
      dispatch(getZapTokenBalances({ address, networkID: networkId, provider: loadProvider }));
      expiredBonds.map(bond => {
        if (bond.getClaimability(networkId)) {
          dispatch(calculateUserBondDetails({ address, bond, provider: loadProvider, networkID: networkId }));
        }
      });
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

  const newAssetsDetected = useAppSelector(state => {
    return (
      state.account.balances &&
      (Number(state.account.balances.gohm) || Number(state.account.balances.sohm) || Number(state.account.balances.ohm)
        ? true
        : false)
    );
  });

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
        segmentUA({
          type: "connect",
          provider: provider,
          context: currentPath,
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  let themeMode = theme === "light" ? lightTheme : theme === "dark" ? darkTheme : gTheme;

  useEffect(() => {
    themeMode = theme === "light" ? lightTheme : darkTheme;
  }, [theme]);

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  const accountBonds = useAppSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });
  const hasActiveV1Bonds = accountBonds.length > 0;

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
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
          {oldAssetsDetected &&
            !hasActiveV1Bonds &&
            trimmedPath.indexOf("dashboard") === -1 &&
            oldAssetsEnoughToMigrate && <CallToAction setMigrationModalOpen={setMigrationModalOpen} />}

          <Switch>
            <Route exact path="/dashboard">
              <TreasuryDashboard />
            </Route>

            <Route exact path="/">
              <Redirect to="/stake" />
            </Route>

            <Route path="/stake">
              {/* if newAssets or 0 assets */}
              {newAssetsDetected || (!newAssetsDetected && !oldAssetsDetected) || !oldAssetsEnoughToMigrate ? (
                <Stake />
              ) : (
                <V1Stake
                  hasActiveV1Bonds={hasActiveV1Bonds}
                  oldAssetsDetected={oldAssetsDetected}
                  setMigrationModalOpen={setMigrationModalOpen}
                />
              )}
            </Route>

            <Route path="/v1-stake">
              <V1Stake
                hasActiveV1Bonds={hasActiveV1Bonds}
                oldAssetsDetected={oldAssetsDetected}
                setMigrationModalOpen={setMigrationModalOpen}
              />
            </Route>

            <Route exact path="/give">
              <CausesDashboard />
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

            <Route exact path="/give/donations">
              <DepositYield />
            </Route>

            <Route exact path="/give/redeem">
              <RedeemYield />
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

            {/* <Route path="/33-together">
              <PoolTogether />
            </Route> */}

            <Redirect from="/bonds-v1" to="/bonds" />

            <Route path="/bonds">
              {bondIndexes.map(index => {
                return (
                  <Route exact key={index} path={`/bonds/${index}`}>
                    <BondV2 index={index} />
                  </Route>
                );
              })}
              <ChooseBondV2 />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
        {hasDust ? (
          <MigrationModalSingle open={migrationModalOpen} handleClose={migModalClose} />
        ) : (
          <MigrationModal open={migrationModalOpen} handleClose={migModalClose} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
