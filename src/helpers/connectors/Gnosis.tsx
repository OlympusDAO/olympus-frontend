import { Chain, Wallet } from "@rainbow-me/rainbowkit";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

export interface GnosisOptions {
  chains: Chain[];
}

export const gnosis = ({ chains }: GnosisOptions): Wallet => ({
  id: "gnosis",
  iconBackground: "#000",
  name: "Gnosis Safe",
  iconUrl:
    "https://registry.walletconnect.org/logo/sm/225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f.jpeg",
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=io.gnosis.safe",
    ios: "https://apps.apple.com/app/id1515759131",
  },
  createConnector: () => {
    const rpc = chains.reduce(
      (rpcUrlMap, chain) => ({
        ...rpcUrlMap,
        [chain.id]: chain.rpcUrls.default,
      }),
      {},
    );
    const connector = new WalletConnectConnector({
      chains,
      options: {
        qrcode: false,
        rpc,
      },
    });

    return {
      connector,
      mobile: {
        getUri: async () => {
          const { uri } = (await connector.getProvider()).connector;
          return `https://gnosis-safe.io//wc?uri=${encodeURIComponent(uri)}`;
        },
      },
      qrCode: {
        getUri: async () => (await connector.getProvider()).connector.uri,
        instructions: {
          learnMoreUrl: "https://learn.rainbow.me/connect-your-wallet-to-a-website-or-app",
          steps: [
            {
              description: "We recommend putting Rainbow on your home screen for faster access to your wallet.",
              step: "install",
              title: "Open the Rainbow app",
            },
            {
              description: "You can easily backup your wallet using our backup feature on your phone.",
              step: "create",
              title: "Create or Import a Wallet",
            },
            {
              description: "After you scan, a connection prompt will appear for you to connect your wallet.",
              step: "scan",
              title: "Tap the scan button",
            },
          ],
        },
      },
    };
  },
});
