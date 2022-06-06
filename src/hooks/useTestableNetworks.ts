import { NetworkId } from "src/networkDetails";

import { useWeb3Context } from ".";

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
  const { networkId } = useWeb3Context();

  return {
    MAINNET: getTestnet(NetworkId.MAINNET, NetworkId.TESTNET_GOERLI, networkId, NetworkId.TESTNET_RINKEBY),
    AVALANCHE: getTestnet(NetworkId.AVALANCHE, NetworkId.AVALANCHE_TESTNET, networkId),
    ARBITRUM: getTestnet(NetworkId.ARBITRUM, NetworkId.ARBITRUM_TESTNET, networkId),
    POLYGON: getTestnet(NetworkId.POLYGON, NetworkId.POLYGON_TESTNET, networkId),
    FANTOM: getTestnet(NetworkId.FANTOM, NetworkId.FANTOM_TESTNET, networkId),
  };
};
