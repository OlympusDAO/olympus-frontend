import "@rainbow-me/rainbowkit/styles.css";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createClient } from "wagmi";
import { arbitrum, arbitrumGoerli, avalanche, boba, fantom, goerli, mainnet, optimism, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

// const boba: Chain = {
//   id: 288,
//   name: "Boba Network",
//   network: "boba",
//   nativeCurrency: {
//     name: "Boba",
//     symbol: "BOBA",
//     decimals: 18,
//   },
//   rpcUrls: { default: { http: ["https://mainnet.boba.network"] } },
//   testnet: false,
// };

// const avalanche: Chain = {
//   name: "Avalanche",
//   network: "avalanche",
//   id: 43114,
//   nativeCurrency: {
//     name: "Avalanche",
//     symbol: "AVAX",
//     decimals: 18,
//   },
//   rpcUrls: { default: { http: "https://rpc.ankr.com/avalanche" } },
// };

// const fantom: Chain = {
//   name: "Fantom",
//   network: "fantom",
//   id: 250,
//   nativeCurrency: {
//     name: "Fantom",
//     symbol: "FTM",
//     decimals: 18,
//   },
//   rpcUrls: { default: { http: "https://rpc.ankr.com/fantom" } },
// };

export const { chains, provider, webSocketProvider } = configureChains(
  [
    {
      ...mainnet,
      rpcUrls: { default: { http: ["https://rpc.ankr.com/eth"] }, public: { http: ["https://rpc.ankr.com/eth"] } },
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
      // iconUrl:
      //   "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_boba.jpg&w=32&q=100",
    },
    {
      ...avalanche,
      // iconUrl:
      //   "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=32&q=100",
    },
    {
      ...fantom,
      // iconUrl:
      //   "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_fantom.jpg&w=32&q=100",
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

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ chains, shimDisconnect: true }),
      braveWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ chains }),
      walletConnectWallet({ chains }),
      coinbaseWallet({ appName: "Olympus DAO", chains }),
      ...(needsInjectedWalletFallback ? [injectedWallet({ chains, shimDisconnect: true })] : []),
    ],
  },
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
