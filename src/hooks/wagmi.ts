import "@rainbow-me/rainbowkit/styles.css";

import { connectorsForWallets, wallet } from "@rainbow-me/rainbowkit";
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
export const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    {
      ...boba,
      iconUrl:
        "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_boba.jpg&w=64&q=100",
    },
    {
      ...avalanche,
      iconUrl:
        "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=64&q=100",
    },
    {
      ...fantom,
      iconUrl:
        "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_fantom.jpg&w=64&q=100",
    },
  ],
  [
    alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
    jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) }),
    publicProvider(),
  ],
);

const connectors = connectorsForWallets([
  {
    groupName: "Wallets",
    wallets: [
      wallet.metaMask({ chains }),
      wallet.coinbase({ appName: "Olympus DAO", chains }),
      wallet.rainbow({ chains }),
      wallet.walletConnect({ chains }),
      wallet.ledger({ chains }),
    ],
  },
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
