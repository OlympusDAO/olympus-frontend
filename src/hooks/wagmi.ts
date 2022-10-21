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
import { Chain, chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const boba: Chain = {
  id: 288,
  name: "Boba Network",
  network: "boba",
  nativeCurrency: {
    name: "Boba",
    symbol: "BOBA",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://mainnet.boba.network",
  },
  testnet: false,
};

const avalanche: Chain = {
  name: "Avalanche",
  network: "avalanche",
  id: 43114,
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: { default: "https://api.avax.network/ext/bc/C/rpc" },
};

const fantom: Chain = {
  name: "Fantom",
  network: "fantom",
  id: 250,
  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  rpcUrls: { default: "https://rpc.fantom.network" },
};
export const { chains, provider, webSocketProvider } = configureChains(
  [
    { ...chain.mainnet, rpcUrls: { default: "https://rpc.ankr.com/eth" } },
    { ...chain.polygon, rpcUrls: { default: "https://rpc.ankr.com/polygon" } },
    { ...chain.optimism, rpcUrls: { default: "https://rpc.ankr.com/optimism" } },
    { ...chain.arbitrum, rpcUrls: { default: "https://rpc.ankr.com/arbitrum" } },
    {
      ...boba,
      iconUrl:
        "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_boba.jpg&w=32&q=100",
    },
    {
      ...avalanche,
      iconUrl:
        "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=32&q=100",
      rpcUrls: { default: "https://rpc.ankr.com/avalanche" },
    },
    {
      ...fantom,
      iconUrl:
        "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_fantom.jpg&w=32&q=100",
      rpcUrls: { default: "https://rpc.ankr.com/fantom" },
    },
    { ...chain.goerli, rpcUrls: { default: "https://rpc.ankr.com/eth_goerli" } },
  ],
  [
    jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) }),
    alchemyProvider({ apiKey: process.env.REACT_APP_ETHEREUM_ALCHEMY_IDS }),
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
