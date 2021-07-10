import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import React, { createContext, useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";

import { INFURA_ID } from "../constants";

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const Web3Context = createContext({
  provider: undefined,
  address: undefined,
  connect: () => {},
  disconnect: () => {},
});

export const useWeb3Context = () => useContext(Web3Context);

export const Web3ContextProvider = ({ children }) => {
  const [provider, setProvider] = useState(undefined);
  const [address, setAddress] = useState(undefined);

  const connect = async () => {
    const web3Provider = new Web3Provider(await web3Modal.connect());

    const network = await web3Provider.getNetwork();
    if (network.chainId !== 1) {
      return alert("Wrong network, please switch to mainnet");
    }

    setProvider(web3Provider);

    const signer = await web3Provider.getSigner();
    setAddress(await signer.getAddress());
  };

  const disconnect = () => {
    web3Modal.clearCachedProvider();
    setProvider(undefined);
    setAddress(undefined);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      console.log("Using cached provider");
      connect();
    } else {
      console.log("Using Infura");
      setProvider(new JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`));
    }
  }, []);

  return <Web3Context.Provider value={{ provider, address, connect, disconnect }}>{children}</Web3Context.Provider>;
};
