import "src/style.scss";

import { useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, ThemeProvider } from "@mui/material/styles";
import {
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Messages from "src/components/Messages/Messages";
import { MigrationCallToAction } from "src/components/MigrationCallToAction";
import { MigrationNotification } from "src/components/MigrationNotification";
import NavDrawer from "src/components/Sidebar/NavDrawer";
import Sidebar from "src/components/Sidebar/Sidebar";
import StagingNotification from "src/components/StagingNotification";
import { StakeVersionContainer } from "src/components/StakeVersionContainer";
import TopBar from "src/components/TopBar/TopBar";
import Wallet from "src/components/TopBar/Wallet";
import { shouldTriggerSafetyCheck } from "src/helpers";
import { useGoogleAnalytics } from "src/hooks/useGoogleAnalytics";
import useTheme from "src/hooks/useTheme";
import { chains } from "src/hooks/wagmi";
import { getMigrationAllowances, loadAccountDetails } from "src/slices/AccountSlice";
import { loadAppDetails } from "src/slices/AppSlice";
import { AppDispatch } from "src/store";
import { dark as darkTheme } from "src/themes/dark.js";
import { girth as gTheme } from "src/themes/girth.js";
import { light as lightTheme } from "src/themes/light.js";
import { BondModalContainer } from "src/views/Bond/components/BondModal/BondModal";
import { BondModalContainerV3 } from "src/views/Bond/components/BondModal/BondModalContainerV3";
import { Lending } from "src/views/Lending";
import { LendingMarkets } from "src/views/Lending/LendingMarkets";
import { Liquidity } from "src/views/Liquidity";
import { ExternalStakePools } from "src/views/Liquidity/ExternalStakePools/ExternalStakePools";
import { Vault } from "src/views/Liquidity/Vault";
import { Vaults } from "src/views/Liquidity/Vaults";
import { useAccount, useConnect, useNetwork, useProvider } from "wagmi";

// Dynamic Imports for code splitting
const Bond = lazy(() => import("./views/Bond"));
const Bridge = lazy(() => import("./views/Bridge"));
const TreasuryDashboard = lazy(() => import("./views/TreasuryDashboard/TreasuryDashboard"));
const NotFound = lazy(() => import("./views/404/NotFound"));
const V1Stake = lazy(() => import("./views/V1-Stake/V1-Stake"));
const Range = lazy(() => import("./views/Range"));

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
    padding: "15px",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    marginLeft: drawerWidth,
    marginTop: "-48.5px",
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
    marginLeft: "264px",
  },
}));

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 264;
const transitionDuration = 969;
function App() {
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const [theme, toggleTheme] = useTheme();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { address = "", isConnected, isReconnecting } = useAccount();
  const { error: errorMessage } = useConnect();

  const provider = useProvider();
  const { chain = { id: 1 } } = useNetwork();

  const [migrationModalOpen, setMigrationModalOpen] = useState(false);
  const migModalClose = () => {
    setMigrationModalOpen(false);
  };

  const isSmallerScreen = useMediaQuery("(max-width: 1047px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

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
    if (whichDetails === "account" && address && isConnected) {
      loadAccount(loadProvider);
    }
  }

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: chain.id, provider: loadProvider }));
    },
    [chain.id, address],
  );

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({ networkID: chain.id, provider, address }));
      dispatch(getMigrationAllowances({ address, provider, networkID: chain.id }));
    },
    [chain.id, address],
  );

  // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.
  useEffect(() => {
    if (shouldTriggerSafetyCheck()) {
      toast("Safety Check: Always verify you're on app.olympusdao.finance!");
    }
    loadDetails("app");
  }, []);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (isConnected && provider) {
      loadDetails("account");
    }
  }, [isConnected, chain.id, provider]);

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage.message);
  }, [errorMessage]);

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
      <RainbowKitProvider
        chains={chains}
        theme={
          theme === "dark"
            ? rainbowDarkTheme({ accentColor: "#676B74" })
            : rainbowLightTheme({ accentColor: "#E0E2E3", accentColorForeground: "#181A1D" })
        }
      >
        <ThemeProvider theme={themeMode}>
          <CssBaseline />
          <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
            <Toaster>{t => <Messages toast={t} />}</Toaster>
            <StagingNotification />
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
              <Suspense fallback={<div></div>}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route
                    path="/stake"
                    element={<StakeVersionContainer setMigrationModalOpen={setMigrationModalOpen} />}
                  />
                  <Route path="/v1-stake" element={<V1Stake setMigrationModalOpen={setMigrationModalOpen} />} />
                  <Route path="/bonds/v3/:id" element={<BondModalContainerV3 />} />
                  <Route path="/bonds/v3/inverse/:id" element={<BondModalContainerV3 />} />
                  <Route path="/bonds/:id" element={<BondModalContainer />} />
                  <Route path="/bonds/inverse/:id" element={<BondModalContainer />} />
                  <Route path="/bonds" element={<Bond />} />
                  <Route path="/bonds/inverse" element={<Bond />} />
                  <Route path="/bridge" element={<Bridge />} />
                  <Route path="/dashboard/*" element={<TreasuryDashboard />} />
                  <Route path="/range/*" element={<Range />} />
                  <Route path="/lending" element={<Lending />} />
                  <Route path="/lending/markets" element={<LendingMarkets />} />
                  <Route path="/liquidity" element={<Liquidity />} />
                  <Route path="/liquidity/pools" element={<ExternalStakePools />} />
                  <Route path="/liquidity/vaults" element={<Vaults />} />
                  <Route path="/liquidity/vaults/:id" element={<Vault />} />

                  <Route
                    path={"/info/*"}
                    element={<Wallet open={true} component="info" theme={theme} toggleTheme={toggleTheme} />}
                  />
                  <Route
                    path={"/utility"}
                    element={<Wallet open={true} component="utility" theme={theme} toggleTheme={toggleTheme} />}
                  />
                  <Route
                    path={"/wallet/history"}
                    element={<Wallet open={true} component="wallet/history" theme={theme} toggleTheme={toggleTheme} />}
                  />
                  <Route
                    path="/wallet"
                    element={<Wallet open={true} component="wallet" theme={theme} toggleTheme={toggleTheme} />}
                  ></Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </div>

          <MigrationNotification isModalOpen={migrationModalOpen} onClose={migModalClose} />
        </ThemeProvider>
      </RainbowKitProvider>
    </StyledDiv>
  );
}

export default App;
