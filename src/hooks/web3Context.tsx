import React, { useState, ReactElement, useContext, useEffect, useMemo, useCallback } from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";

// TODO(zayenx): REMEMBER THIS!!!
// Use this in production!
function getMainnetURI() {
  const INFURA_ID_LIST = [
    "5e3c4a19b5f64c99bf8cd8089c92b44d", // this is main dev node
    "d9836dbf00c2440d862ab571b462e4a3", // this is current prod node
    "31e6d348d16b4a4dacde5f8a47da1971", // this is primary fallback
    "76cc9de4a72c4f5a8432074935d670a3", // Adding Zayen's to the mix
  ];

  const randomIndex = Math.floor(Math.random() * INFURA_ID_LIST.length);
  const randomInfuraID = INFURA_ID_LIST[randomIndex];
  return `https://mainnet.infura.io/v3/${randomInfuraID}`;
}

function getTestnetURI() {
  return "https://rinkeby.infura.io/v3/d9836dbf00c2440d862ab571b462e4a3";
}

// https://cloudflare-eth.com is also an option
// function getAlchemyAPI() {
//   return "https://eth-mainnet.alchemyapi.io/v2/R3yNR4xHH6R0PXAG8M1ODfIq-OHd-d3o";
// }

function getAlchemyAPI(chainID: Number) {
  const ALCHEMY_ID_LIST = [
    "R3yNR4xHH6R0PXAG8M1ODfIq-OHd-d3o", // this is Zayen's
    "DNj81sBwBcgdjHHBUse4naHaW82XSKtE", // this is Girth's
  ];

  const randomIndex = Math.floor(Math.random() * ALCHEMY_ID_LIST.length);
  const randomAlchemyID = ALCHEMY_ID_LIST[randomIndex];
  if (chainID === 1) return `https://eth-mainnet.alchemyapi.io/v2/${randomAlchemyID}`;
  else if (chainID === 4) return `https://eth-rinkeby.alchemyapi.io/v2/aF5TH9E9RGZwaAUdUd90BNsrVkDDoeaO`; // unbanksy's
}

/*
  Types
*/
type onChainProvider = {
  connect: () => void;
  disconnect: () => void;
  provider: JsonRpcProvider;
  address: string;
  connected: Boolean;
  web3Modal: Web3Modal;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " + "please declare it at a higher level.",
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [chainID, setChainID] = useState(4);
  const [uri, setUri] = useState(getAlchemyAPI(chainID));
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider(uri)); // TODO(ZayenX): pls remember to change this back to infura.

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>(
    new Web3Modal({
      // network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              1: getAlchemyAPI(chainID),
              4: getTestnetURI(),
            },
          },
        },
      },
    }),
  );

  const _hasCachedProvider = (): Boolean => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  const _initListeners = useCallback(() => {
    if (!provider) return;

    provider.on("accountsChanged", () => {
      if (_hasCachedProvider()) return;
      setTimeout(() => window.location.reload(), 1);
    });

    provider.on("chainChanged", (chain: number) => {
      if (_hasCachedProvider()) return;
      _checkNetwork(chain);
      setTimeout(() => window.location.reload(), 1);
    });
  }, [provider]);

  // Eventually we will not need this method.
  const _checkNetwork = (otherChainID: number): Boolean => {
    if (chainID !== otherChainID) {
      console.warn("You are switching networks");
      if (otherChainID === 1 || otherChainID === 4) {
        setChainID(otherChainID);
        otherChainID === 1 ? setUri(getAlchemyAPI(chainID)) : setUri(getTestnetURI());
        return true;
      }
      return false;
    }
    return true;
  };

  const connect = useCallback(async () => {
    const rawProvider = await web3Modal.connect();
    const connectedProvider = new Web3Provider(rawProvider);

    const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
    const connectedAddress = await connectedProvider.getSigner().getAddress();

    const validNetwork = _checkNetwork(chainId);
    if (!validNetwork) {
      console.error("Wrong network, please switch to mainnet");
      return;
    }
    // Save everything after we've validated the right nextwork.
    // Eventually we'll be fine without doing network validations.
    setConnected(true);
    setAddress(connectedAddress);
    setProvider(connectedProvider);
    _initListeners();

    return connectedProvider;
  }, [provider, web3Modal, connected]);

  const disconnect = useCallback(async () => {
    console.log("disconnecting");
    web3Modal.clearCachedProvider();
    setConnected(false);

    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  const onChainProvider = useMemo(
    () => ({ connect, disconnect, provider, connected, address, chainID, web3Modal }),
    [connect, disconnect, provider, connected, address, chainID, web3Modal],
  );

  useEffect(() => {
    if (_hasCachedProvider()) {
      connect();
    }
  }, []);

  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
