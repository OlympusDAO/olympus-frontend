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
        default: { http: ["https://rpc.ankr.com/eth"] },
        public: { http: ["https://rpc.ankr.com/eth"] },
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
    {
      id: 8453,
      name: "Base",
      network: "base",
      iconUrl: "/assets/images/base.svg",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: {
          http: ["https://rpc.ankr.com/base"],
        },
        public: {
          http: ["https://rpc.ankr.com/base"],
        },
      },
      blockExplorers: {
        default: {
          name: "Basescan",
          url: "https://basescan.org",
        },
      },
      contracts: {
        l2OutputOracle: {
          [1]: {
            address: "0x56315b90c40730925ec5485cf004d835058518A0",
          },
        },
        multicall3: {
          address: "0xca11bde05977b3631167028862be2a173976ca11",
          blockCreated: 5022,
        },
        portal: {
          [1]: {
            address: "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e",
            blockCreated: 17482143,
          },
        },
        l1StandardBridge: {
          [1]: {
            address: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
            blockCreated: 17482143,
          },
        },
      },
    },
    goerli,
    arbitrumGoerli,
    {
      id: 17000,
      network: "holesky",
      name: "Holesky",
      iconUrl: "/assets/images/ethereum.png",
      nativeCurrency: { name: "Holesky Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: {
          http: ["https://ethereum-holesky.publicnode.com"],
        },
        public: {
          http: ["https://ethereum-holesky.publicnode.com"],
        },
      },
      contracts: {
        multicall3: {
          address: "0xca11bde05977b3631167028862be2a173976ca11",
          blockCreated: 77,
        },
      },
    },
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
