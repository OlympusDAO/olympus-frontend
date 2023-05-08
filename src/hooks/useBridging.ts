import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt, ethers } from "ethers";
import toast from "react-hot-toast";
import { CROSS_CHAIN_BRIDGE_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { CROSS_CHAIN_BRIDGE_CONTRACT, CROSS_CHAIN_BRIDGE_CONTRACT_TESTNET } from "src/constants/contracts";
import { isTestnet } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { balanceQueryKey, useOhmBalance } from "src/hooks/useBalance";
import { EthersError } from "src/lib/EthersTypes";
import { NetworkId } from "src/networkDetails";
import { CrossChainBridgeTestnet } from "src/typechain";
import { BridgeReceivedEvent, BridgeTransferredEvent, CrossChainBridge } from "src/typechain/CrossChainBridge";
import { layerZeroChainIdsFromEVM, useBridgeableTestableNetwork } from "src/views/Bridge/helpers";
import { useAccount, useBlockNumber, useNetwork, useSigner } from "wagmi";

export interface IHistoryTx {
  timestamp: string;
  amount: string;
  transactions: {
    sendingChain: string;
    receivingChain?: string;
  };
  confirmations: string;
  send: boolean;
  chainId: number;
}

export interface IBridgeOhm {
  destinationChainId: number;
  recipientAddress: string;
  amount: string;
}

export interface IBridgeFee {
  nativeFee: DecimalBigNumber;
  zroFee: DecimalBigNumber;
  gasFee?: DecimalBigNumber;
}

const normalizedBridgeContract = ({ chainId }: { chainId: number }): CrossChainBridge | CrossChainBridgeTestnet => {
  const contractConstant = isTestnet(chainId) ? CROSS_CHAIN_BRIDGE_CONTRACT_TESTNET : CROSS_CHAIN_BRIDGE_CONTRACT;
  return contractConstant.getEthersContract(chainId);
};

export const useEstimateSendFee = ({ destinationChainId, recipientAddress, amount }: IBridgeOhm) => {
  const { chain = { id: 1, name: "Mainnet" } } = useNetwork();
  const network = useBridgeableTestableNetwork();
  const { data: signer } = useSigner();

  return useQuery<IBridgeFee, Error>(
    ["estimateSendFee", destinationChainId, amount, recipientAddress],
    async () => {
      if (!signer) throw new Error("No signer");
      const destinationExists =
        !!CROSS_CHAIN_BRIDGE_ADDRESSES[destinationChainId as keyof typeof CROSS_CHAIN_BRIDGE_ADDRESSES];
      if (!destinationExists) throw new Error("Bridging to the chosen chain is not enabled");

      const bridgeContract = normalizedBridgeContract({ chainId: network });
      if (!bridgeContract) throw new Error("Bridging doesn't exist on current network. Please switch networks.");
      if (Number(amount) === 0) throw new Error("You cannot bridge 0 OHM");
      const decimalAmount = new DecimalBigNumber(amount, 9);
      console.log("decimalAmount", decimalAmount);
      const layerZeroChainId = layerZeroChainIdsFromEVM({ evmChainId: destinationChainId });
      const fee = await bridgeContract.estimateSendFee(
        String(layerZeroChainId),
        recipientAddress,
        decimalAmount.toBigNumber(),
        "0x",
      );
      try {
        // gas fees
        // in gwei
        const gasUnits = new DecimalBigNumber(
          await bridgeContract
            .connect(signer)
            .estimateGas.sendOhm(String(layerZeroChainId), recipientAddress, decimalAmount.toBigNumber(), {
              value: fee.nativeFee,
            }),
          9,
        );
        console.log("gas units", gasUnits);
        const gasPrice = new DecimalBigNumber(await signer.getGasPrice(), 9);
        console.log("gasprice", gasPrice);
        const gasFee = gasUnits.mul(gasPrice);
        console.log("gasfee", gasFee);

        return {
          nativeFee: new DecimalBigNumber(fee.nativeFee, 18),
          zroFee: new DecimalBigNumber(fee.zroFee, 18),
          gasFee,
        };
      } catch {
        return {
          nativeFee: new DecimalBigNumber(fee.nativeFee, 18),
          zroFee: new DecimalBigNumber(fee.zroFee, 18),
        };
      }
    },
    {
      enabled: !!chain && Number(amount) > 0 && !!signer && !!recipientAddress,
    },
  );
};

export const useBridgeOhm = () => {
  const client = useQueryClient();

  const { address = "" } = useAccount();
  const { chain = { id: 1, name: "Mainnet" } } = useNetwork();
  const { data: signer } = useSigner();
  const network = useBridgeableTestableNetwork();
  const bridgeContract = normalizedBridgeContract({ chainId: network });
  const { data: ohmBalance = new DecimalBigNumber("0", 9) } = useOhmBalance()[network];

  return useMutation<ContractReceipt, EthersError, IBridgeOhm>(
    async ({ destinationChainId, recipientAddress, amount }: IBridgeOhm) => {
      const destinationExists =
        !!CROSS_CHAIN_BRIDGE_ADDRESSES[destinationChainId as keyof typeof CROSS_CHAIN_BRIDGE_ADDRESSES];
      if (!destinationExists) throw new Error("Bridging to the chosen chain is not enabled");
      if (!bridgeContract) throw new Error("Bridging doesn't exist on current network. Please switch networks.");
      if (Number(amount) === 0) throw new Error("You cannot bridge 0 OHM");
      if (!ohmBalance) throw new Error("Something went wrong. Please refresh your screen & try again.");
      const decimalAmount = new DecimalBigNumber(amount, 9);
      if (ohmBalance.lt(decimalAmount))
        throw new Error(`You cannot bridge more than your OHM balance on ${chain.name}`);
      if (!signer) throw new Error("No signer");

      const layerZeroChainId = layerZeroChainIdsFromEVM({ evmChainId: destinationChainId });
      const fee = await bridgeContract.estimateSendFee(
        String(layerZeroChainId),
        recipientAddress,
        decimalAmount.toBigNumber(),
        "0x",
      );
      const transaction = await bridgeContract
        .connect(signer)
        .sendOhm(String(layerZeroChainId), recipientAddress, decimalAmount.toBigNumber(), { value: fee.nativeFee });

      return transaction.wait();
    },
    {
      onError: (error: any) => toast.error("error" in error ? error.error.message : error.message),
      onSuccess: async () => {
        toast.success("Successfully bridged");
        await client.refetchQueries([balanceQueryKey(address, OHM_ADDRESSES, chain.id)]);
      },
    },
  );
};

export const useGetBridgeTransferredEvents = (chainId: number) => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const contract = normalizedBridgeContract({ chainId });
  const { data: blockNumber, isError: blockNumberError } = useBlockNumber({ chainId });
  return useQuery<IHistoryTx[], Error>(
    ["GetBridgingEvents", chainId, address],
    async () => {
      // using EVENTS
      if (!address) throw new Error("Cannot get transfer events without a connected wallet");
      if (!signer) throw new Error("Cannot get transfer events without a signer");
      if ([NetworkId.TESTNET_GOERLI, NetworkId.ARBITRUM_GOERLI].includes(chainId)) {
        const queryContract = contract.connect(signer) as CrossChainBridgeTestnet;
        const sendOhmEvents = await queryContract.queryFilter(queryContract.filters.BridgeTransferred());
        const receiveOhmEvents = await queryContract.queryFilter(queryContract.filters.BridgeReceived());
        return [
          ...sendOhmEvents
            .filter((event: BridgeTransferredEvent) => event.args.sender_ === address)
            .map((event: BridgeTransferredEvent) => mapBridgeEvents({ event, blockNumber, type: "send", chainId })),
          ...receiveOhmEvents
            .filter((event: BridgeReceivedEvent) => event.args.receiver_ === address)
            .map((event: BridgeReceivedEvent) => mapBridgeEvents({ event, blockNumber, type: "receive", chainId })),
        ];
      } else {
        const queryContract = contract as CrossChainBridge;
        const sendOhmEvents = await queryContract.queryFilter(queryContract.filters.BridgeTransferred(address));
        const receiveOhmEvents = await queryContract.queryFilter(queryContract.filters.BridgeReceived(address));
        return [
          ...sendOhmEvents.map((event: BridgeTransferredEvent) =>
            mapBridgeEvents({ event, blockNumber, type: "send", chainId }),
          ),
          ...receiveOhmEvents.map((event: BridgeReceivedEvent) =>
            mapBridgeEvents({ event, blockNumber, type: "receive", chainId }),
          ),
        ];
      }
    },
    { enabled: !!chainId && !!contract && !!address && !!signer && (!!blockNumber || blockNumberError) },
  );
};

const mapBridgeEvents = ({
  event,
  blockNumber,
  type,
  chainId,
}: {
  event: BridgeTransferredEvent | BridgeReceivedEvent;
  blockNumber?: number;
  type: "send" | "receive";
  chainId: number;
}): IHistoryTx => {
  console.log("event block", event.blockNumber, blockNumber);
  const confirmations = blockNumber && blockNumber - event.blockNumber;
  return {
    timestamp: String(event.blockNumber),
    amount: ethers.utils.formatUnits(event.args.amount_, 9),
    transactions: { sendingChain: event.transactionHash },
    confirmations: confirmations ? (confirmations <= 100 ? String(confirmations) : "> 100") : "1",
    send: type === "send",
    chainId,
  };
};
