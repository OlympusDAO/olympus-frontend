import React, { useCallback, useContext, useMemo, useReducer, useState } from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { IFrameEthereumProvider } from "@ledgerhq/iframe-provider";
import { NodeHelper } from "src/helpers/NodeHelper";
import { NetworkId, NETWORKS } from "../constants";
import { isIFrame } from "src/helpers";

const modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          [NetworkId.MAINNET]: NETWORKS[NetworkId.MAINNET].uri(),
          [NetworkId.TESTNET_RINKEBY]: NETWORKS[NetworkId.TESTNET_RINKEBY].uri(),
          [NetworkId.ARBITRUM]: NETWORKS[NetworkId.ARBITRUM].uri(),
          [NetworkId.ARBITRUM_TESTNET]: NETWORKS[NetworkId.ARBITRUM_TESTNET].uri(),
          [NetworkId.AVALANCHE]: NETWORKS[NetworkId.AVALANCHE].uri(),
          [NetworkId.AVALANCHE_TESTNET]: NETWORKS[NetworkId.AVALANCHE_TESTNET].uri(),
        },
      },
    },
  },
});

type Web3State =
  | { isConnected: true; provider: Web3Provider }
  | { isConnected: false; provider: typeof defaultProvider };

type Web3Context = Web3State & {
  hasCachedProvider: boolean;
  disconnect: () => void;
  connect: () => Promise<void>;
};

const web3Context = React.createContext<Web3Context | null>(null);

enum ActionType {
  CONNECT,
  DISCONNECT,
}

interface Action {
  type: ActionType;
  payload?: any;
}

const reducer = (_: Web3State, { type, payload }: Action): Web3State => {
  switch (type) {
    case ActionType.CONNECT: {
      const { provider } = payload;
      return { isConnected: true, provider };
    }
    case ActionType.DISCONNECT: {
      return defaultState;
    }
  }
};

const defaultProvider = NodeHelper.getMainnetStaticProvider();

const defaultState: Web3State = {
  isConnected: false,
  provider: defaultProvider,
};

export const Web3ContextProvider: React.FC = props => {
  const [web3Modal] = useState(modal);
  const [state, dispatch] = useReducer(reducer, defaultState);

  const hasCachedProvider = !!web3Modal.cachedProvider;

  const connect = useCallback(async () => {
    const rawProvider = isIFrame() ? new IFrameEthereumProvider() : await web3Modal.connect();
    const provider = new Web3Provider(rawProvider, "any");
    dispatch({ type: ActionType.CONNECT, payload: { provider } });
  }, [web3Modal]);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    dispatch({ type: ActionType.DISCONNECT });
  }, [web3Modal]);

  const value = useMemo(
    () => ({ connect, disconnect, hasCachedProvider, ...state }),
    [connect, disconnect, hasCachedProvider, state],
  );

  return <web3Context.Provider value={value}>{props.children}</web3Context.Provider>;
};

export const useWeb3Context = () => {
  const value = useContext(web3Context);

  if (!value)
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, please declare it at a higher level.",
    );

  return value;
};
