import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { useCallback, useState } from "react";

import { INFURA_ID, NETWORKS, BONDS } from "../constants";

// TODO: How to programatically select this?
// URLS to rotate with
const NODE_URI = "homestead";
const defaultProvider = ethers.getDefaultProvider(NODE_URI);
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

export const useWeb3Context = () => {
  // const web3ReactContext = useWeb3React();
  // const provider = wallet.ethereum;
  const web3ReactContext = useWeb3React();
  const provider = web3ReactContext.library;

  return { provider, ...web3ReactContext };
};

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  return library;
}

/*
  Wrapper context provider around web3 react. 
  Web3-react returns `library` while the codebase expects provider
*/
export const Web3ContextProvider = ({ children }) => {
  [provider, setProvider] = useState();

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

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  // Connect to provider if cachedProvider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>;
};

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
