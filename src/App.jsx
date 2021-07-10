import { Container, useMediaQuery } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import ClearIcon from "@material-ui/icons/Clear";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { Flex } from "rimble-ui";
import { ThemeProvider } from "styled-components";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/js/all";

import { loadAccountDetails } from "./actions/Account.actions";
import { loadAppDetails } from "./actions/App.actions";
import { calcBondDetails } from "./actions/Bond.actions";
import Sidebar from "./components/Sidebar/Sidebar";
import TopBar from "./components/TopBar/TopBar";
import { Stake, ChooseBond, Bond, Dashboard } from "./views";
import Migrate from "./views/Stake/Migrate";
import NotFound from "./views/404/NotFound";

import { NETWORKS, BONDS } from "./constants";
import { GlobalStyles } from "./global";
import { useWeb3Context } from "./hooks/Web3Context";
import useTheme from "./hooks/useTheme";
import { lightTheme, darkTheme, gTheme } from "./theme";

import "./App.css";

const targetNetwork = NETWORKS.mainnet;
const blockExplorer = targetNetwork.blockExplorer;

const App = () => {
  const { address, provider } = useWeb3Context();

  const dispatch = useDispatch();
  const location = useLocation();
  const [theme, toggleTheme, mounted] = useTheme();

  const isSmallerScreen = useMediaQuery("(max-width: 1125px)");
  // const isUltraSmallScreen = useMediaQuery("(max-width:495px)");

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // const handleSidebarOpen = () => {
  //   setIsSidebarExpanded(true);
  // };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  useEffect(() => {
    if (isSidebarExpanded) {
      handleSidebarClose();
    }
  }, [location]);

  // const currentBlock  = useSelector(state => state.app.currentBlock);
  const currentIndex = useSelector(state => state.app.currentIndex);

  // const fraxBondDiscount = useSelector(state => state.bonding.frax && state.bonding.frax.bondDiscount);
  // const daiBondDiscount = useSelector(state => state.bonding.dai && state.bonding.dai.bondDiscount);
  // const ohmDaiBondDiscount = useSelector(state => state.bonding.ohm_dai_lp && state.bonding.ohm_dai_lp.bondDiscount);
  // const ohmFraxLpBondDiscount = useSelector(
  //   state => state.bonding.ohm_frax_lp && state.bonding.ohm_frax_lp.bondDiscount,
  // );

  const loadDetails = async () => {
    dispatch(loadAppDetails({ networkID: 1, provider }));

    if (address) {
      dispatch(loadAccountDetails({ networkID: 1, provider, address }));
    }

    [BONDS.ohm_dai, BONDS.dai, BONDS.ohm_frax, BONDS.frax].map(async bond => {
      dispatch(calcBondDetails({ networkID: 1, provider, bond, value: null }));
    });
  };

  useEffect(() => {
    if (address && provider) {
      loadDetails();
    }
  }, [provider, address]);

  let themeMode = theme === "light" ? lightTheme : theme === "dark" ? darkTheme : gTheme;
  useEffect(() => {
    themeMode = theme === "light" ? lightTheme : darkTheme;
  });

  if (!mounted) {
    return <div />;
  }

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <GlobalStyles />

      <div className="app">
        <Flex id="dapp" className={`dapp ${isSmallerScreen && "mobile"}`}>
          {!isSidebarExpanded && (
            <nav className="navbar navbar-expand-lg navbar-light justify-content-end d-lg-none">
              <button
                className="navbar-toggler"
                type="button"
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                aria-expanded="false"
                aria-label="Toggle navigation"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
              >
                <span className="navbar-toggler-icon" />
              </button>
            </nav>
          )}

          {isSidebarExpanded && (
            // eslint-disable-next-line
            <a role="button" className="close-nav" onClick={() => setIsSidebarExpanded(false)}>
              <ClearIcon />
            </a>
          )}

          <Sidebar
            currentIndex={currentIndex}
            isExpanded={isSidebarExpanded}
            theme={theme}
            onClick={() => {
              if (isSidebarExpanded) {
                handleSidebarClose();
              } else {
                console.log("Sidebar collapsed");
              }
            }}
          />

          <Container maxWidth="xl">
            <TopBar blockExplorer={blockExplorer} theme={theme} toggleTheme={toggleTheme} />

            <Switch>
              <Route exact path="/dashboard">
                <Dashboard />
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

              <Route path="/bonds">
                {[BONDS.ohm_dai, BONDS.dai, BONDS.ohm_frax, BONDS.frax].map(bond => {
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
          </Container>
        </Flex>
      </div>
    </ThemeProvider>
  );
};

export default App;
