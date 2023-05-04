import { BRIDGEABLE_CHAINS } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { useNetwork } from "wagmi";

/** will return undefined if not a bridgeable chain... */
export const chainDetails = (currentChain: NetworkId) => {
  return BRIDGEABLE_CHAINS[currentChain as keyof typeof BRIDGEABLE_CHAINS];
};

export const useBridgeableChains = () => {
  const { chain = { id: 1 } } = useNetwork();
  const data = chainDetails(chain.id);
  console.log("data", data);
  return {
    data,
    isInvalid: !data,
  };
};

/** returns useTestableNetworks result filtered on current network for Bridgeable Chains */
export const useBridgeableTestableNetwork = () => {
  const { chain = { id: 1 } } = useNetwork();
  const networks = useTestableNetworks();
  switch (chain.id) {
    case NetworkId.ARBITRUM_GOERLI:
    case NetworkId.ARBITRUM:
      return networks.ARBITRUM;
    case NetworkId.TESTNET_GOERLI:
    case NetworkId.MAINNET:
    default:
      return networks.MAINNET;
  }
};

/**
 * - testnet per: https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses
 * - mainnet per: https://layerzero.gitbook.io/docs/technical-reference/mainnet/supported-chain-ids
 */
export const layerZeroChainIdsFromEVM = ({ evmChainId }: { evmChainId: number }) => {
  switch (evmChainId) {
    case NetworkId.ARBITRUM_GOERLI:
      return 10143;
    case NetworkId.TESTNET_GOERLI:
      return 10121;
    case NetworkId.ARBITRUM:
      return 110;
    case NetworkId.OPTIMISM:
      return 111;
    case NetworkId.MAINNET:
    default:
      return 101;
  }
};
