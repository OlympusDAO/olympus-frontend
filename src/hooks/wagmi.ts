import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { Chain, chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
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
export const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    {
      ...boba,
      iconUrl:
        "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_boba.jpg&w=64&q=75",
    },
  ],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
