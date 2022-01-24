import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { IFrameEthereumProvider } from "@ledgerhq/iframe-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import React, { ReactElement, useCallback, useContext, useMemo, useState } from "react";
import { idFromHexString, initNetworkFunc } from "src/helpers/NetworkHelper";
import { NodeHelper } from "src/helpers/NodeHelper";
import Web3Modal from "web3modal";

import { NETWORKS } from "../constants";

/**
 * determine if in IFrame for Ledger Live
 */
function isIframe() {
  return window.location !== window.parent.location;
}

/*
  Types
*/
type onChainProvider = {
  connect: () => Promise<Web3Provider | undefined>;
  disconnect: () => void;
  hasCachedProvider: () => boolean;
  address: string;
  connected: boolean;
  provider: JsonRpcProvider;
  web3Modal: Web3Modal;
  networkId: number;
  networkName: string;
  providerUri: string;
  providerInitialized: boolean;
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
  return useMemo<onChainProvider>(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

const initModal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          1: NETWORKS[1].uri(),
          4: NETWORKS[4].uri(),
          42161: NETWORKS[42161].uri(),
          421611: NETWORKS[421611].uri(),
          43113: NETWORKS[43113].uri(),
          43114: NETWORKS[43114].uri(),
        },
      },
    },
  },
});

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  // NOTE (appleseed): loading eth mainnet as default rpc provider for a non-connected wallet
  const [provider, setProvider] = useState<JsonRpcProvider>(NodeHelper.getMainnetStaticProvider());
  const [networkId, setNetworkId] = useState(1);
  const [networkName, setNetworkName] = useState("");
  const [providerUri, setProviderUri] = useState("");
  const [providerInitialized, setProviderInitialized] = useState(false);

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>(initModal);

  const hasCachedProvider = (): boolean => {
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

      rawProvider.on("chainChanged", async (_chainId: string) => {
        const newChainId = idFromHexString(_chainId);
        const networkHash = await initNetworkFunc({ provider });
        if (newChainId !== networkHash.networkId) {
          // then provider is out of sync, reload per metamask recommendation
          setTimeout(() => window.location.reload(), 1);
        } else {
          setNetworkId(networkHash.networkId);
        }
      });
    },
    [provider],
  );

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    // handling Ledger Live;
    let rawProvider;
    if (isIframe()) {
      rawProvider = new IFrameEthereumProvider();
    } else {
      rawProvider = await web3Modal.connect();
    }

    // new _initListeners implementation matches Web3Modal Docs
    // ... see here: https://github.com/Web3Modal/web3modal/blob/2ff929d0e99df5edf6bb9e88cff338ba6d8a3991/example/src/App.tsx#L185
    _initListeners(rawProvider);

    const connectedProvider = new Web3Provider(rawProvider, "any");
    setProvider(connectedProvider);
    const connectedAddress = await connectedProvider.getSigner().getAddress();

    // Save everything after we've validated the right network.
    // Eventually we'll be fine without doing network validations.
    setAddress(connectedAddress);
    const networkHash = await initNetworkFunc({ provider: connectedProvider });
    console.log("networkHash", networkHash);
    setNetworkId(networkHash.networkId);
    setNetworkName(networkHash.networkName);
    setProviderUri(networkHash.uri);
    setProviderInitialized(networkHash.initialized);
    // Keep this at the bottom of the method, to ensure any repaints have the data we need
    setConnected(true);

    return connectedProvider;
  }, [provider, web3Modal, connected]);

  const disconnect = useCallback(async () => {
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
      hasCachedProvider,
      provider,
      connected,
      address,
      web3Modal,
      networkId,
      networkName,
      providerUri,
      providerInitialized,
    }),
    [
      connect,
      disconnect,
      hasCachedProvider,
      provider,
      connected,
      address,
      web3Modal,
      networkId,
      networkName,
      providerUri,
      providerInitialized,
    ],
  );

  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
