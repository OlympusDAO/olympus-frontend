import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { formatEther, parseEther } from "@ethersproject/units";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Alert, Button, Col, Menu, Row } from "antd";
import "antd/dist/antd.css";
import { useUserAddress } from "eth-hooks";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/all.js';
import { useSelector, useDispatch } from 'react-redux';

import { loadAppDetails } from './actions/App.actions.js';
import { loadAccountDetails } from './actions/Account.actions.js';

import Stake from "./components/Stake";
import Bond from "./components/Bond";

import "./App.css";
import "./style.scss";
import { Header, ThemeSwitch, } from "./components";

import Sidebar from "./components/Sidebar";
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
const scaffoldEthProvider = new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
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

function App(props: any) {
  const dispatch = useDispatch();

  console.log("scaffoldEthProvider = ", scaffoldEthProvider)
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
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });


  async function loadDetails() {
    if (injectedProvider)
      await dispatch(loadAppDetails({ networkID: 1, provider: injectedProvider }))

    if (address)
      await dispatch(loadAccountDetails({networkID: 1, address, provider: injectedProvider}));
  }

  useEffect(() => {
    loadDetails();
  }, [injectedProvider, address]);

  // let networkDisplay = "";
  // if (localChainId && selectedChainId && localChainId !== selectedChainId) {
  //   const networkSelected = NETWORK(selectedChainId);
  //   const networkLocal = NETWORK(localChainId);
  //   if (selectedChainId === 1337 && localChainId === 31337) {
  //     networkDisplay = (
  //       <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
  //         <Alert
  //           message="⚠️ Wrong Network ID"
  //           description={
  //             <div>
  //               You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
  //               HardHat.
  //               <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
  //             </div>
  //           }
  //           type="error"
  //           closable={false}
  //         />
  //       </div>
  //     );
  //   } else {
  //     networkDisplay = (
  //       <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
  //         <Alert
  //           message="⚠️ Wrong Network"
  //           description={
  //             <div>
  //               You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
  //               <b>{networkLocal && networkLocal.name}</b>.
  //             </div>
  //           }
  //           type="error"
  //           closable={false}
  //         />
  //       </div>
  //     );
  //   }
  // } else {
  //   networkDisplay = (
  //     <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
  //       {targetNetwork.name}
  //     </div>
  //   );
  // }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider) as any);
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute((window as any).location.pathname);
  }, [setRoute]);

  return (
    <div className="app">
      <div id="dapp" className="dapp min-vh-100">
        <div className="container-fluid">
          <div className="row">
            <Header blockExplorer={blockExplorer} address={address} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} web3Modal={web3Modal} userProvider={userProvider} mainnetProvider={mainnetProvider} />



            <Sidebar web3Modal={web3Modal} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} mainnetProvider={mainnetProvider} blockExplorer={blockExplorer} address={address} route={route} isExpanded={true} setRoute={setRoute} />

            <Switch>
              <Route exact path="/">
                <Stake address={address} provider={injectedProvider} />
              </Route>


              {Object.values(BONDS).map(bond => {
                return <Route exact key={bond} path={`/bonds/${bond}`}>
                  <Bond bond={bond} address={address} provider={injectedProvider} />
                </Route>
              })}


            </Switch>


            <ThemeSwitch />
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable */
window.ethereum &&
  window.ethereum.on("chainChanged", (chainId: any) => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

window.ethereum &&
  window.ethereum.on("accountsChanged", (accounts: any) => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });
/* eslint-enable */

export default App;
