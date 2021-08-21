import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Hidden, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "./hooks/useTheme";
import { useAddress, useWeb3Context } from "./hooks/web3Context";

import { calcBondDetails } from "./slices/BondSlice";
import { loadAppDetails } from "./slices/AppSlice";
import { loadAccountDetails } from "./slices/AccountSlice";

import { Stake, ChooseBond, Bond, TreasuryDashboard, PoolTogether } from "./views";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";
import Migrate from "./views/Stake/Migrate";
import NavDrawer from "./components/Sidebar/NavDrawer.jsx";
import LoadingSplash from "./components/Loading/LoadingSplash";
import NotFound from "./views/404/NotFound";

import { dark as darkTheme } from "./themes/dark.js";
import { light as lightTheme } from "./themes/light.js";
import { girth as gTheme } from "./themes/girth.js";

import { BONDS } from "./constants";
import "./style.scss";

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
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();
  const location = useLocation();
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallerScreen = useMediaQuery("(max-width: 900px)");
  const isSmallScreen = useMediaQuery("(max-width: 620px)");

  const { provider, chainID, connected } = useWeb3Context();
  // TODO (zx): this should go into web3Context.tsx
  provider.on("network", (_newNetwork, oldNetwork) => {
    if (!oldNetwork) return;
    window.location.reload();
  });

  const address = useAddress();

  const isAppLoading = useSelector(state => state.app.loading);

  async function loadDetails(whichDetails) {
    // NOTE (unbanksy): If you encounter the following error:
    // Unhandled Rejection (Error): call revert exception (method="balanceOf(address)", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.4.0)
    // it's because the initial provider loaded always starts with chainID=1. This causes
    // address lookup on the wrong chain which then throws the error. To properly resolve this,
    // we shouldn't be initializing to chainID=1 in web3Context without first listening for the
    // network. To actually test rinkeby, change setChainID equal to 4 before testing.
    let loadProvider = provider;

    // NOTE (appleseed): loadDetails() runs three times on every app refresh...
    // ... once with address === "" && loadProvider === StaticJsonRpcProvider (set inside of Web3ContextProvider)
    // ... once with address === "[wallet address]" && loadProvider === StaticJsonRpcProvider (set inside of Web3Context.connect())
    // ... once with address === "[wallet address]" && loadProvider === Web3Provider (set inside of Web3Context.connect() right after the above line)
    // So we need to make sure we don't run `loadAccountDetails`, `loadAppDetails` & `calcBondDetails`...
    // ... below each of the three times state is changed
    // The below if statements are one way to prevent the 3x runs
    //
    // don't run except when address === "" && provider is a API Provider (not Metamask)
    // `loadDetails()` always runs once with address === "" even when the user has a connected wallet.
    if (whichDetails === "app") {
      await dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
    }
    // don't run unless provider is a Wallet...
    // NOTE (appleseed): Is there a smarter way to verify that Provider is a Wallet (not just metamask)?
    if (whichDetails === "account" && address && connected) {
      await dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
    }

    // don't run except when address === "" && provider is a API Provider (not Metamask)
    // `loadDetails()` always runs once with address === "" even when the user has a connected wallet.
    if (whichDetails === "app") {
      Object.values(BONDS).map(async bond => {
        await dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: chainID }));
      });
    }
  }

  useEffect(() => {
    // runs only on initial paint
    loadDetails("app");
  }, []);

  useEffect(() => {
    // runs only when connected is changed
    loadDetails("account");
  }, [connected]);

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

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      {/* {isAppLoading && <LoadingSplash />} */}
      <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"}`}>
        <TopBar theme={theme} toggleTheme={toggleTheme} handleDrawerToggle={handleDrawerToggle} />
        <nav className={classes.drawer}>
          <Hidden mdUp>
            <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          </Hidden>
          <Hidden smDown>
            <Sidebar />
          </Hidden>
        </nav>

        <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
          <Switch>
            <Route exact path="/dashboard">
              <TreasuryDashboard />
            </Route>

            <Route exact path="/">
              <Redirect to="/stake" />
            </Route>

            <Route path="/stake">
              <Stake />
              <Route exact path="/stake/migrate">
                <Migrate />
              </Route>
            </Route>

            <Route path="/33-together">
              <PoolTogether />
            </Route>

            <Route path="/bonds">
              {Object.values(BONDS).map(bond => {
                return (
                  <Route exact key={bond} path={`/bonds/${bond}`}>
                    <Bond bond={bond} />
                  </Route>
                );
              })}
              <ChooseBond />
            </Route>

            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
