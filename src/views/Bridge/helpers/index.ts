import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { BRIDGEABLE_CHAINS } from "src/constants/addresses";
import { CROSS_CHAIN_BRIDGE_CONTRACT } from "src/constants/contracts";
import { IHistoryTx } from "src/hooks/useBridging";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { BridgeReceivedEvent, BridgeTransferredEvent } from "src/typechain/CrossChainBridge";
import { useAccount, useBlockNumber, useNetwork, useSigner } from "wagmi";

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
    case NetworkId.MAINNET:
    default:
      return 101;
  }
};

// export const getBridgeEventsForWalletAndChain = ({
//   chainId,
//   walletAddress,
// }: {
//   chainId: number;
//   walletAddress: string;
// }) => {
//   const bridgeContract = CROSS_CHAIN_BRIDGE_CONTRACT.getEthersContract(chainId);
// };

export const useGetBridgeTransferredEvents = () => {
  const { chain = { id: 1 } } = useNetwork();
  const { address } = useAccount();
  // const archiveProvider = useArchiveNodeProvider(chain?.id);
  const contract = CROSS_CHAIN_BRIDGE_CONTRACT.getEthersContract(chain.id);
  // const provider = Providers.getStaticProvider(chain.id);
  const { data: signer } = useSigner();
  const { data: blockNumber, isError, isLoading } = useBlockNumber();

  return useQuery<IHistoryTx[], Error>(
    ["GetBridgingEvents", chain.id, address],
    async () => {
      // using EVENTS
      if (!address) throw new Error("Cannot get transfer events without a connected wallet");
      if (!signer) throw new Error("Cannot get transfer events without a signer");
      // const sendOhmEvents = await contract.queryFilter(contract.filters.BridgeTransferred(address));
      // const receiveOhmEvents = await contract.queryFilter(contract.filters.BridgeReceived(address));
      const sendOhmEvents = await contract.queryFilter(contract.filters.BridgeTransferred());
      const receiveOhmEvents = await contract.queryFilter(contract.filters.BridgeReceived());
      console.log("events", sendOhmEvents, receiveOhmEvents);
      return [
        ...sendOhmEvents.map((event: BridgeTransferredEvent) => mapBridgeEvents(event, blockNumber)),
        ...receiveOhmEvents.map((event: BridgeReceivedEvent) => mapBridgeEvents(event, blockNumber)),
      ];
      // const contract = IERC20__factory.connect(OHM_ADDRESSES[chain.id as keyof typeof OHM_ADDRESSES], signer);
      // const sendOhmEvents = await contract.queryFilter(
      //   contract.filters.Transfer(address, ethers.constants.AddressZero),
      // );
      // const receiveOhmEvents = await contract.queryFilter(
      //   contract.filters.Transfer(ethers.constants.AddressZero, address),
      // );
      // return [...sendOhmEvents, ...receiveOhmEvents];
    },
    { enabled: !!chain && !!chain.id && !!contract && !!address && !!signer },
  );
};

const mapBridgeEvents = (event: BridgeTransferredEvent | BridgeReceivedEvent, blockNumber?: number): IHistoryTx => {
  const confirmations = blockNumber && blockNumber - event.blockNumber;
  return {
    timestamp: String(event.blockNumber),
    amount: ethers.utils.formatUnits(event.args.amount_, 9),
    transactions: { sendingChain: event.transactionHash },
    confirmations: confirmations ? (confirmations <= 100 ? String(confirmations) : "> 100") : "1",
  };
};
