import { NetworkId } from "src/networkDetails";

import { useWeb3Context } from ".";

const getTestnet = <TTargetNetwork extends NetworkId, TTestNetwork extends NetworkId>(
  targetNetwork: TTargetNetwork,
  testNetwork: TTestNetwork,
  currentNetwork: NetworkId,
): TTargetNetwork | TTestNetwork => {
  return currentNetwork === testNetwork ? testNetwork : targetNetwork;
};

export const useTestableNetworks = () => {
  const { networkId } = useWeb3Context();

  return {
    MAINNET: getTestnet(NetworkId.MAINNET, NetworkId.TESTNET_RINKEBY, networkId),
  };
};
