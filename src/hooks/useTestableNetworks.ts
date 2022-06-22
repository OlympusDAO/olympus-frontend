import { NetworkId } from "src/networkDetails";
import { useNetwork } from "wagmi";

const getTestnet = <TTargetNetwork extends NetworkId, TTestNetwork extends NetworkId>(
  targetNetwork: TTargetNetwork,
  testNetwork: TTestNetwork,
  currentNetwork: NetworkId,
  secondTestNetwork?: TTestNetwork,
): TTargetNetwork | TTestNetwork => {
  return secondTestNetwork && currentNetwork === secondTestNetwork
    ? secondTestNetwork
    : currentNetwork === testNetwork
    ? testNetwork
    : targetNetwork;
};

export const useTestableNetworks = () => {
  const { activeChain = { id: 1 } } = useNetwork();

  return {
    MAINNET: getTestnet(NetworkId.MAINNET, NetworkId.TESTNET_GOERLI, activeChain.id, NetworkId.TESTNET_RINKEBY),
    AVALANCHE: getTestnet(NetworkId.AVALANCHE, NetworkId.AVALANCHE_TESTNET, activeChain.id),
    ARBITRUM: getTestnet(NetworkId.ARBITRUM, NetworkId.ARBITRUM_TESTNET, activeChain.id),
    POLYGON: getTestnet(NetworkId.POLYGON, NetworkId.POLYGON_TESTNET, activeChain.id),
    FANTOM: getTestnet(NetworkId.FANTOM, NetworkId.FANTOM_TESTNET, activeChain.id),
  };
};
