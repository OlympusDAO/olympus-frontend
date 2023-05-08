import { NetworkId } from "src/networkDetails";
import { useNetwork } from "wagmi";

/** if currentNetwork === testNetwork, then use testNetwork, else use targetNetwork */
const getTestnet = <TTargetNetwork extends NetworkId, TTestNetwork extends NetworkId>(
  targetNetwork: TTargetNetwork,
  testNetwork: TTestNetwork,
  currentNetwork: NetworkId,
): TTargetNetwork | TTestNetwork => {
  return currentNetwork === testNetwork ? testNetwork : targetNetwork;
};

export const useTestableNetworks = () => {
  const { chain = { id: 1 } } = useNetwork();

  return {
    MAINNET: getTestnet(NetworkId.MAINNET, NetworkId.TESTNET_GOERLI, chain.id),
    AVALANCHE: getTestnet(NetworkId.AVALANCHE, NetworkId.AVALANCHE_TESTNET, chain.id),
    ARBITRUM_V0: getTestnet(NetworkId.ARBITRUM, NetworkId.ARBITRUM_TESTNET, chain.id),
    ARBITRUM: getTestnet(NetworkId.ARBITRUM, NetworkId.ARBITRUM_GOERLI, chain.id),
    POLYGON: getTestnet(NetworkId.POLYGON, NetworkId.POLYGON_TESTNET, chain.id),
    FANTOM: getTestnet(NetworkId.FANTOM, NetworkId.FANTOM_TESTNET, chain.id),
  };
};
