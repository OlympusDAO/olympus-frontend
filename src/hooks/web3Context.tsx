import React, { useState, ReactElement, useContext } from "react";
import Web3Modal from "web3modal";
import { BaseProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { ethers } from "ethers";

import { INFURA_ID, NETWORKS, BONDS } from "../constants";

// TODO(zayenx): REMEMBER THIS!!!
// Use this in production!
function getMainnetURI() {
  const INFURA_ID_LIST = [
    "5e3c4a19b5f64c99bf8cd8089c92b44d", // this is main dev node
    "d9836dbf00c2440d862ab571b462e4a3", // this is current prod node
    "31e6d348d16b4a4dacde5f8a47da1971", // this is primary fallback
  ];

  const chosenInfuraID = Math.floor(Math.random() * INFURA_ID_LIST.length);
  return `https://mainnet.infura.io/v3/${chosenInfuraID}`;
}

function getAlchemyAPI() {
  return "https://eth-mainnet.alchemyapi.io/v2/R3yNR4xHH6R0PXAG8M1ODfIq-OHd-d3o";
}

class Web3Connector {
  private _connected: Boolean;
  _provider: BaseProvider | null;
  _chainID: number;
  _web3Modal: Web3Modal;
  _updateCallback: Function;

  constructor() {
    // We can configure which network we connectTo
    this._chainID = 1;
    // We can have methods to control this provider
    this._provider = ethers.getDefaultProvider(getAlchemyAPI());
    this._connected = false;
    this._updateCallback = () => {
      console.log("No updateCallback set for Web3Connector ");
    };

    this._web3Modal = new Web3Modal({
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
  }

  get provider() {
    return this._provider;
  }
  get connected(): Boolean {
    return this._connected;
  }

  set updateCallback(updateCallback: Function) {
    this._updateCallback();
  }

  _initListeners() {
    if (!this._provider) return;

    this._provider.on("accountsChanged", () => {
      if (!this.hasCachedProvider()) return;
      setTimeout(() => window.location.reload(), 1);
    });

    this._provider.on("chainChanged", () => {
      if (!this.hasCachedProvider) return;
      setTimeout(() => window.location.reload(), 1);
    });
  }

  hasCachedProvider(): Boolean {
    if (this._web3Modal.cachedProvider) {
      return true;
    }
    return false;
  }

  checkNetwork(chainID: number): Boolean {
    if (this._chainID !== chainID) {
      console.error("Wrong network, please switch to mainnet");
      return false;
    }
    return true;
  }

  async connect() {
    console.log("connecting");
    const rawProvider = await this._web3Modal.connect();
    const provider = new Web3Provider(rawProvider);

    const chainId = await provider.getNetwork().then(network => network.chainId);
    const validNetwork = this.checkNetwork(chainId);
    if (!validNetwork) {
      console.error("Wrong network, please switch to mainnet");
      return;
    }
    console.log("connected");
    // Save everything after we've validated the right nextwork.
    // Eventually we'll be fine without doing network validations.
    this.updateConnectionState(true);
    this._provider = provider;
    this._initListeners();
    return provider;
  }

  async disconnect() {
    console.log("disconnecting");
    this._web3Modal.clearCachedProvider();
    this.updateConnectionState(false);
    setTimeout(() => {
      window.location.reload();
    }, 1);
  }

  async updateConnectionState(isConnected: Boolean) {
    this._connected = isConnected;
    this._updateCallback(isConnected);
  }
}

export type Web3ContextData = {
  web3: Web3Connector;
  web3Connected: Boolean;
};

const defaultWeb3 = new Web3Connector();

export const Web3Context = React.createContext<Web3ContextData>({
  web3: defaultWeb3,
  web3Connected: false,
});

export const useWeb3Context = () => {
  const { web3, web3Connected } = useContext(Web3Context);
  const provider = web3.provider;

  return { provider, web3, web3Connected };
};

export const useAddress = () => {
  const { web3, web3Connected } = useContext(Web3Context);
  if (!web3Connected) return;
  if (!(web3.provider instanceof Web3Provider)) return;

  return useUserAddress(web3.provider);
};

/*
  Wrapper context provider around web3 react. 
  Web3-react returns `library` while the codebase expects provider'
  The only reason this file is a .tsx
*/
export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const web3Context = useContext(Web3Context);
  if (web3Context !== null) {
    throw new Error("<Web3ContextProvider /> has already been declared.");
  }

  const [connected, setConnected] = useState<Boolean>(false);
  const [address, setAddress] = useState<string>("");
  const isConnectedCB = (isConnected: Boolean) => {
    setConnected(isConnected);
  };

  defaultWeb3.updateCallback = isConnectedCB;

  return (
    <Web3Context.Provider value={{ web3: defaultWeb3, web3Connected: connected }}>{children}</Web3Context.Provider>
  );
};
