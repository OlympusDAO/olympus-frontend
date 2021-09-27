import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Web3Modal from "web3modal";
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider, WebSocketProvider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { EnvHelper } from "../helpers/Environment";
import { NETWORKS } from "../constants";

/**
 * kept as function to mimic `getMainnetURI()`
 * @returns string
 */
function getTestnetURI(chainId: number) {
  switch (chainId) {
    case 4:
      return EnvHelper.alchemyEthereumTestnetURI;
    case 421611:
      return EnvHelper.alchemyArbitrumTestnetURI;
  }
  return "";
}

/**
 * "intelligently" loadbalances production API Keys
 * @returns string
 */
function getMainnetURI(chainId: number): string {
  // Shuffles the URIs for "intelligent" loadbalancing
  const allURIs = EnvHelper.getAPIUris(chainId).sort(() => Math.random() - 0.5);

  // There is no lightweight way to test each URL. so just return a random one.
  // if (workingURI !== undefined || workingURI !== "") return workingURI as string;
  const randomIndex = Math.floor(Math.random() * allURIs.length);
  return allURIs[randomIndex];
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
  // NOTE (appleseed): if you are testing on rinkeby you need to set chainId === 4 as the default for non-connected wallet testing...
  // ... you also need to set getTestnetURI() as the default uri state below
  const [chainID, setChainID] = useState(1);
  const [chainName, setChainName] = useState("Ethereum");
  const [address, setAddress] = useState("");
  const [uri, setUri] = useState(getMainnetURI(1));

  // if websocket we need to change providerType
  const providerType = () => {
    if (uri.indexOf("ws://") === 0 || uri.indexOf("wss://") === 0) {
      return new WebSocketProvider(uri);
    } else {
      return new StaticJsonRpcProvider(uri);
    }
  };
  const [provider, setProvider] = useState<JsonRpcProvider>(providerType);

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>(
    new Web3Modal({
      // network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              1: getMainnetURI(1),
              4: getTestnetURI(4),
              42161: getMainnetURI(42161),
              421611: getTestnetURI(421611),
            },
          },
        },
      },
    }),
  );

  const hasCachedProvider = (): Boolean => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  // NOTE (appleseed): none of these listeners are needed for Backend API Providers
  // ... so I changed these listeners so that they only apply to walletProviders, eliminating
  // ... polling to the backend providers for network changes
  const _initListeners = useCallback(
    rawProvider => {
      if (!rawProvider.on) {
        return;
      }
      rawProvider.on("accountsChanged", async (accounts: string[]) => {
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("chainChanged", async (chain: number) => {
        _checkNetwork(chain);
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("network", (_newNetwork: any, oldNetwork: any) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    [provider],
  );

  // Eventually we will not need this method.
  const _checkNetwork = (otherChainID: number): Boolean => {
    if (chainID !== otherChainID) {
      console.warn("You are switching networks");
      if (otherChainID === 1 || otherChainID === 4 || otherChainID === 42161 || otherChainID === 421611) {
        setChainID(otherChainID);
        switch (otherChainID) {
          case 1:
            setUri(getMainnetURI(otherChainID));
            setChainName("Ethereum");
            break;
          case 4:
            setUri(getTestnetURI(4));
            setChainName("Rinkeby Testnet");
            break;
          case 42161:
            setUri(getMainnetURI(otherChainID));
            setChainName("Arbitrum");
            break;
          case 421611:
            setUri(getTestnetURI(421611));
            setChainName("Arbitrum Testnet");
            break;
        }
        return true;
      }
      return false;
    }
    return true;
  };

  const switchChain = async (id: number) => {
    // We use decimal numbers for the chain ID, before making a request to the wallet, we need to format this as a hex string
    const hexString = "0x" + id.toString(16);
    try {
      await provider.send("wallet_switchEthereumChain", [{ chainId: hexString }]);
    } catch (e) {
      // If the chain has not been added to the user's wallet
      if (e.code === 4902) {
        try {
          const network = NETWORKS[id];
          const params = [
            {
              chainId: hexString,
              chainName: network["chainName"],
              nativeCurrency: network["nativeCurrency"],
              rpcUrls: network["rpcUrls"],
              blockExplorerUrls: network["blockExplorerUrls"],
            },
          ];
          await provider.send("wallet_addEthereumChain", params);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    const rawProvider = await web3Modal.connect();

    // new _initListeners implementation matches Web3Modal Docs
    // ... see here: https://github.com/Web3Modal/web3modal/blob/2ff929d0e99df5edf6bb9e88cff338ba6d8a3991/example/src/App.tsx#L185
    _initListeners(rawProvider);

    const connectedProvider = new Web3Provider(rawProvider, "any");

    const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
    const connectedAddress = await connectedProvider.getSigner().getAddress();

    const validNetwork = _checkNetwork(chainId);
    if (!validNetwork) {
      console.error("Wrong network, please switch to mainnet");
      setChainName("Unsupported Chain!");
      return;
    }
    // Save everything after we've validated the right network.
    // Eventually we'll be fine without doing network validations.
    setAddress(connectedAddress);
    setProvider(connectedProvider);

    // Keep this at the bottom of the method, to ensure any repaints have the data we need
    setConnected(true);

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
    () => ({
      connect,
      disconnect,
      switchChain,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainID,
      chainName,
      web3Modal,
    }),
    [connect, disconnect, switchChain, hasCachedProvider, provider, connected, address, chainID, chainName, web3Modal],
  );

  useEffect(() => {
    // Don't try to connect here. Do it in App.jsx
    // console.log(hasCachedProvider());
    // if (hasCachedProvider()) {
    //   connect();
    // }
  }, []);

  // initListeners needs to be run on rawProvider... see connect()
  // useEffect(() => {
  //   _initListeners();
  // }, [connected]);

  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
