import "./style.scss";

import { i18n } from "@lingui/core";
import { useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, ThemeProvider } from "@mui/material/styles";
import { MultifarmProvider } from "@multifarm/widget";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Messages from "./components/Messages/Messages";
import { MigrationCallToAction } from "./components/MigrationCallToAction";
import { MigrationNotification } from "./components/MigrationNotification";
import NavDrawer from "./components/Sidebar/NavDrawer";
import Sidebar from "./components/Sidebar/Sidebar";
import StagingNotification from "./components/StagingNotification";
import { StakeVersionContainer } from "./components/StakeVersionContainer";
import TopBar from "./components/TopBar/TopBar";
import Wallet from "./components/TopBar/Wallet";
import { shouldTriggerSafetyCheck } from "./helpers";
import { trackGAEvent } from "./helpers/analytics/trackGAEvent";
import { getMultiFarmApiKey } from "./helpers/multifarm";
import { categoryTypesConfig, strategyTypesConfig } from "./helpers/multifarm";
import { useWeb3Context } from "./hooks";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import useTheme from "./hooks/useTheme";
import { getMigrationAllowances, loadAccountDetails } from "./slices/AccountSlice";
import { loadAppDetails } from "./slices/AppSlice";
import { error, info } from "./slices/MessagesSlice";
import { AppDispatch } from "./store";
import { dark as darkTheme } from "./themes/dark.js";
import { girth as gTheme } from "./themes/girth.js";
import { light as lightTheme } from "./themes/light.js";
import { multifarmDarkTheme, multifarmLightTheme } from "./themes/multifarm";
import { Bond, Give, TreasuryDashboard, V1Stake, Wrap, Zap } from "./views";
import NotFound from "./views/404/NotFound";
import Bridge from "./views/Bridge";

const PREFIX = "App";

const classes = {
  drawer: `${PREFIX}-drawer`,
  content: `${PREFIX}-content`,
  contentShift: `${PREFIX}-contentShift`,
  toolbar: `${PREFIX}-toolbar`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  notification: `${PREFIX}-notification`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`& .${classes.drawer}`]: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  [`& .${classes.content}`]: {
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

  [`& .${classes.contentShift}`]: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },

  // necessary for content to be below app bar
  [`& .${classes.toolbar}`]: theme.mixins.toolbar,

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
  },

  [`& .${classes.notification}`]: {
    marginLeft: "312px",
  },
}));

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 312;
const transitionDuration = 969;

const MULTIFARM_API_KEY = getMultiFarmApiKey();

function App() {
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const [theme, toggleTheme] = useTheme();

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
    <StyledDiv>
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
              <MigrationCallToAction setMigrationModalOpen={setMigrationModalOpen} />

              <Routes>
                <Route path="/" element={<Navigate to="/stake" />} />
                <Route
                  path="/stake"
                  element={<StakeVersionContainer setMigrationModalOpen={setMigrationModalOpen} />}
                />
                <Route path="/v1-stake" element={<V1Stake setMigrationModalOpen={setMigrationModalOpen} />} />
                <Route path="/give/*" element={<Give />} />

                <Route path="/olympusgive" element={<Navigate to="/give" />} />
                <Route path="/olygive" element={<Navigate to="/give" />} />
                <Route path="/tyche" element={<Navigate to="/give" />} />
                <Route path="/olympusdaogive" element={<Navigate to="/give" />} />
                <Route path="/ohmgive" element={<Navigate to="/give" />} />

                <Route path="/wrap" element={<Wrap />} />
                <Route path="/zap" element={<Zap />} />
                <Route path="/bonds/*" element={<Bond />} />
                <Route path="/bridge" element={<Bridge />} />
                <Route path="/dashboard/*" element={<TreasuryDashboard />} />

                <Route path={"/info/*"} element={<Wallet open={true} component="info" />} />
                <Route path={"/utility"} element={<Wallet open={true} component="utility" />} />
                <Route path={"/wallet/history"} element={<Wallet open={true} component="wallet/history" />} />
                <Route path="/wallet" element={<Wallet open={true} component="wallet" />}></Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>

          <MigrationNotification isModalOpen={migrationModalOpen} onClose={migModalClose} />
        </MultifarmProvider>
      </ThemeProvider>
    </StyledDiv>
  );
}

export default App;
