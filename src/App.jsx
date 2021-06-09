import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { formatEther, parseEther } from "@ethersproject/units";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ThemeProvider } from "styled-components";
import useTheme from "./hooks/useTheme";
import { useUserAddress } from "eth-hooks";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/all.js';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Flex } from 'rimble-ui';
import { Container, Grid } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

import { calcBondDetails, } from './actions/Bond.actions.js';
import { loadAppDetails, getMarketPrice, getTokenSupply } from './actions/App.actions.js';
import { loadAccountDetails } from './actions/Account.actions.js';

import { Stake, ChooseBond, Bond, Dashboard } from './views'
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";

// import "./App.css";
// import "./style.scss";
// import { Header } from "./components";

import { lightTheme, darkTheme, gTheme } from "./theme";
import { GlobalStyles } from "./global";


import { DAI_ABI, DAI_ADDRESS, INFURA_ID, NETWORK, NETWORKS, BONDS } from "./constants";
import { Transactor } from "./helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useEventListener,
  useExchangePrice,
  useExternalContractLoader,
  useGasPrice,
  useOnBlock,
  useUserProvider,
} from "./hooks";
// import Hints from "./Hints";
import { ExampleUI, Hints, Subgraph } from "./views";
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
const DEBUG = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
// const scaffoldEthProvider = new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

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

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

function App(props) {
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();

  // const [themeMode, setThemeMode] = useState(lightTheme);
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;
  const mainnetProvider = mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, null);
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider);

  // EXTERNAL CONTRACT EXAMPLE:
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });


  async function loadDetails() {
      let loadProvider = mainnetProvider;
      if (injectedProvider) loadProvider = injectedProvider;

      await dispatch(loadAppDetails({ networkID: 1, provider: loadProvider }))
      await dispatch(getMarketPrice({ networkID: 1, provider: loadProvider }));
      await dispatch(getTokenSupply({ networkID: 1, provider: loadProvider }));

      if (address) await dispatch(loadAccountDetails({networkID: 1, address, provider: loadProvider}));

      ["ohm_dai_lp", "dai"].map(async bond => {
        await dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: 1 }));
      })
  }

  useEffect(() => {
    loadDetails();
  }, [injectedProvider, address]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();

  useEffect(() => {
    setRoute((window).location.pathname);
  }, [setRoute]);
  

  let themeMode = theme === "light" ? lightTheme : theme === "dark" ? darkTheme : gTheme;

  useEffect(() => {
    console.log('theme effect', theme);
    themeMode = theme === "light" ? lightTheme : darkTheme;
  })

  if (!mounted) {
    return <div />
  };


  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <GlobalStyles />
      <div className="app">
        <Flex id="dapp" className="dapp">

          <nav className="navbar navbar-expand-lg navbar-light justify-content-end d-md-none">
            <button
              className="navbar-toggler"
              type="button"
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </nav>

          <Sidebar 
            web3Modal={web3Modal} 
            loadWeb3Modal={loadWeb3Modal} 
            logoutOfWeb3Modal={logoutOfWeb3Modal} 
            mainnetProvider={mainnetProvider} 
            blockExplorer={blockExplorer} 
            address={address} 
            route={route} 
            isExpanded={isSidebarExpanded} 
            setRoute={setRoute}
            theme={theme}
          />
  
          <Container maxWidth="xl">
            <TopBar 
              web3Modal={web3Modal} 
              loadWeb3Modal={loadWeb3Modal} 
              logoutOfWeb3Modal={logoutOfWeb3Modal} 
              mainnetProvider={mainnetProvider} 
              blockExplorer={blockExplorer} 
              address={address} 
              route={route} 
              theme={theme}
              toggleTheme={toggleTheme}
            />

            {/* <Box className="dapp-view">  */}
              <Switch>
                <Route exact path="/dashboard">
                  <Dashboard address={address} provider={injectedProvider} />
                </Route>

                <Route exact path="/">
                  <Stake address={address} provider={injectedProvider} />
                </Route>

                <Route exact path="/bonds">
                  <ChooseBond address={address} provider={injectedProvider} />
                </Route>

                {Object.values(BONDS).map(bond => {
                  return <Route exact key={bond} path={`/bonds/${bond}`}>
                    <Bond bond={bond} address={address} provider={injectedProvider} />
                  </Route>
                })}
              </Switch>
            {/* </Box> */}
          </Container>
              
          <div className={`ohm-backdrop ${isSidebarExpanded ? 'ohm-backdrop-show' : 'ohm-backdrop-close'}`} onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}></div>
          
        </Flex>
      </div>      
    </ThemeProvider>
  );
}

/* eslint-disable */
window.ethereum &&
  window.ethereum.on("chainChanged", (chainId ) => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

window.ethereum &&
  window.ethereum.on("accountsChanged", (accounts ) => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });
/* eslint-enable */

export default App;
