import "@rainbow-me/rainbowkit/styles.css";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { configureChains, createClient } from "wagmi";
import { arbitrum, arbitrumGoerli, avalanche, boba, fantom, goerli, mainnet, optimism, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

export const { chains, provider, webSocketProvider } = configureChains(
  [
    {
      ...mainnet,
      rpcUrls: {
        default: { http: ["https://rpc.tenderly.co/fork/f7571dd4-342e-457a-a83b-670b6a84e4c4"] },
        public: { http: ["https://rpc.tenderly.co/fork/f7571dd4-342e-457a-a83b-670b6a84e4c4"] },
      },
    },
    {
      ...polygon,
      rpcUrls: {
        default: { http: ["https://rpc.ankr.com/polygon"] },
        public: { http: ["https://rpc.ankr.com/polygon"] },
      },
    },
    {
      ...optimism,
      rpcUrls: {
        default: { http: ["https://rpc.ankr.com/optimism"] },
        public: { http: ["https://rpc.ankr.com/optimism"] },
      },
    },
    {
      ...arbitrum,
      rpcUrls: {
        default: { http: ["https://rpc.ankr.com/arbitrum"] },
        public: { http: ["https://rpc.ankr.com/arbitrum"] },
      },
    },
    {
      ...boba,
    },
    {
      ...avalanche,
    },
    {
      ...fantom,
    },
    goerli,
    arbitrumGoerli,
  ],
  [
    // jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) }),
    jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default.http[0] }) }),
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }),
    publicProvider(),
  ],
);

const needsInjectedWalletFallback =
  typeof window !== "undefined" && window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet;

const walletConnectProjectId = Environment.getWalletConnectProjectId() as string;

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId: walletConnectProjectId, chains, shimDisconnect: true }),
      braveWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ projectId: walletConnectProjectId, chains }),
      walletConnectWallet({ projectId: walletConnectProjectId, chains }),
      coinbaseWallet({ appName: "Olympus DAO", chains }),
      rabbyWallet({ chains, shimDisconnect: true }),
      okxWallet({ projectId: walletConnectProjectId, chains }),
      safeWallet({ chains }),
      ...(needsInjectedWalletFallback ? [injectedWallet({ chains, shimDisconnect: true })] : []),
    ],
  },
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
