import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ThemeProvider } from "@material-ui/core/styles";
import { useUserAddress } from "eth-hooks";
import { useCallback, useEffect, useState } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import Web3Modal from "web3modal";
import { useDispatch } from "react-redux";
import { Hidden, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "./hooks/useTheme";

import { calcBondDetails } from "./actions/Bond.actions.js";
import { loadAppDetails } from "./actions/App.actions.js";
import { loadAccountDetails } from "./actions/Account.actions.js";

import { Stake, ChooseBond, Bond, Dashboard } from "./views";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";
import Migrate from "./views/Stake/Migrate";
import NavDrawer from "./components/Sidebar/NavDrawer.jsx";
import NotFound from "./views/404/NotFound";

import { dark as darkTheme } from "./themes/dark.js";
import { light as lightTheme } from "./themes/light.js";
import { girth as gTheme } from "./themes/girth.js";

import { INFURA_ID, NETWORKS, BONDS } from "./constants";
import { useUserProvider } from "./hooks";
import "./style.scss";

/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth
 
    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.mainnet; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
// const scaffoldEthProvider = new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);

// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

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

function App(props) {
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();
  const location = useLocation();
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallerScreen = useMediaQuery("(max-width: 960px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  // const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;
  const mainnetProvider = mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, null);
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  // const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(mainnetProvider, address);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  // const writeContracts = useContractLoader(userProvider);

  // EXTERNAL CONTRACT EXAMPLE:
  // If you want to bring in the mainnet DAI contract it would look like:
  // const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI);

  // If you want to call a function on a new block
  /* useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  }); */

  async function loadDetails() {
    let loadProvider = mainnetProvider;
    if (injectedProvider) loadProvider = injectedProvider;

    await dispatch(loadAppDetails({ networkID: 1, provider: loadProvider }));
    if (address) await dispatch(loadAccountDetails({ networkID: 1, address, provider: loadProvider }));

    [BONDS.ohm_dai, BONDS.dai, BONDS.ohm_frax, BONDS.frax].map(async bond => {
      await dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: 1 }));
    });
  }

  useEffect(() => {
    loadDetails();
  }, [injectedProvider, address]);

  const loadWeb3Modal = useCallback(async () => {
    const rawProvider = await web3Modal.connect();
    const provider = new Web3Provider(rawProvider);

    const chainId = await provider.getNetwork().then(network => network.chainId);
    if (chainId !== 1) {
      console.error("Wrong network, please switch to mainnet");
    } else {
      setInjectedProvider(provider);
    }
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  let themeMode = theme === "light" ? lightTheme : theme === "dark" ? darkTheme : gTheme;

  useEffect(() => {
    themeMode = theme === "light" ? lightTheme : darkTheme;
  }, [theme]);

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  if (!mounted) {
    return <div />;
  }

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"}`}>
        <TopBar
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          theme={theme}
          toggleTheme={toggleTheme}
          handleDrawerToggle={handleDrawerToggle}
        />
        <nav className={classes.drawer}>
          <Hidden mdUp>
            <NavDrawer address={address} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          </Hidden>
          <Hidden smDown>
            <Sidebar address={address} />
          </Hidden>
        </nav>

        <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
          <Switch>
            <Route exact path="/dashboard">
              <Dashboard address={address} provider={injectedProvider} />
            </Route>

            <Route exact path="/">
              <Redirect to="/stake" />
            </Route>

            <Route path="/stake">
              <Stake
                address={address}
                provider={injectedProvider}
                web3Modal={web3Modal}
                loadWeb3Modal={loadWeb3Modal}
              />
              <Route exact path="/stake/migrate">
                <Migrate
                  address={address}
                  provider={injectedProvider}
                  web3Modal={web3Modal}
                  loadWeb3Modal={loadWeb3Modal}
                />
              </Route>
            </Route>

            <Route path="/bonds">
              {/* {Object.values(BONDS).map(bond => { */}
              {[BONDS.ohm_dai, BONDS.dai, BONDS.ohm_frax, BONDS.frax].map(bond => {
                return (
                  <Route exact key={bond} path={`/bonds/${bond}`}>
                    <Bond bond={bond} address={address} provider={injectedProvider} />
                  </Route>
                );
              })}
              <ChooseBond address={address} provider={injectedProvider} />
            </Route>

            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </ThemeProvider>
  );
}

/* eslint-disable */
window.ethereum &&
  window.ethereum.on("chainChanged", chainId => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

window.ethereum &&
  window.ethereum.on("accountsChanged", accounts => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });
/* eslint-enable */

export default App;
