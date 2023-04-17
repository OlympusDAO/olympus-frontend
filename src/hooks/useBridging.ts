import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt, ethers } from "ethers";
import toast from "react-hot-toast";
import { CROSS_CHAIN_BRIDGE_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { CROSS_CHAIN_BRIDGE_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { balanceQueryKey, useOhmBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { EthersError } from "src/lib/EthersTypes";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const historyQueryKey = (address: string | `0x${string}`, chainId?: number) => [
  "useGetBridgeHistory",
  address,
  chainId,
];

export interface IHistoryTx {
  timestamp: string;
  amount: string;
  transactions: {
    sendingChain: string;
    receivingChain: string;
  };
  confirmations: number;
}

export interface IBridgeOhm {
  destinationChainId: number;
  recipientAddress: string;
  amount: string;
}

export interface IBridgeFee {
  nativeFee: DecimalBigNumber;
  zroFee: DecimalBigNumber;
}

export const useEstimateSendFee = ({ destinationChainId, recipientAddress, amount }: IBridgeOhm) => {
  const client = useQueryClient();
  const { address = "" } = useAccount();
  const { chain = { id: 1, name: "Mainnet" } } = useNetwork();
  const networks = useTestableNetworks();

  return useQuery<IBridgeFee, Error>(
    ["estimateSendFee", destinationChainId, amount],
    async () => {
      const destinationExists =
        !!CROSS_CHAIN_BRIDGE_ADDRESSES[destinationChainId as keyof typeof CROSS_CHAIN_BRIDGE_ADDRESSES];
      if (!destinationExists) throw new Error("Bridging to the chosen chain is not enabled");

      const bridgeContract = CROSS_CHAIN_BRIDGE_CONTRACT.getEthersContract(networks.MAINNET);
      if (!bridgeContract) throw new Error("Bridging doesn't exist on current network. Please switch networks.");
      if (Number(amount) === 0) throw new Error("You cannot bridge 0 OHM");
      const decimalAmount = new DecimalBigNumber(amount, 9);
      console.log("decimalAmount", decimalAmount);
      const adapterParams = ethers.utils.formatBytes32String("");

      const fee = await bridgeContract.estimateSendFee(
        // destinationChainId,
        String(10143),
        recipientAddress,
        decimalAmount.toBigNumber(),
        // adapterParams,
        "0x",
      );

      console.log("qfee", fee);
      return {
        nativeFee: new DecimalBigNumber(fee.nativeFee, 18),
        zroFee: new DecimalBigNumber(fee.zroFee, 18),
      };
    },
    {
      enabled: !!chain && Number(amount) > 0,
    },
  );
};

export const useBridgeOhm = () => {
  const client = useQueryClient();

  const { address = "" } = useAccount();
  const { chain = { id: 1, name: "Mainnet" } } = useNetwork();
  const networks = useTestableNetworks();
  const bridgeContract = CROSS_CHAIN_BRIDGE_CONTRACT.getEthersContract(networks.MAINNET);
  const { data: signer } = useSigner();
  const ohmBalance = useOhmBalance()[networks.MAINNET].data;

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
        throw new Error(`You cannot bridge more than your OHM balance on this ${chain.name}`);
      if (!signer) throw new Error("No signer");
      const fee = await bridgeContract.estimateSendFee(
        String(10143),
        recipientAddress,
        decimalAmount.toBigNumber(),
        "0x",
      );
      console.log("fee", fee);
      const transaction = await bridgeContract
        .connect(signer)
        .sendOhm(String(10143), recipientAddress, decimalAmount.toBigNumber(), { value: fee.nativeFee });
      // .sendOhm(String(destinationChainId), recipientAddress, amount);

      return transaction.wait();
    },
    {
      onError: (error: any) => toast.error("error" in error ? error.error.message : error.message),
      onSuccess: async () => {
        toast.success("Successfully approved");
        await client.refetchQueries([balanceQueryKey(address, OHM_ADDRESSES, chain.id)]);
      },
    },
  );
};

/** claim info for the connected wallet */
export const useGetBridgeHistory = () => {
  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();

  return useQuery<IHistoryTx[], Error>(
    [historyQueryKey(address, chain?.id)],
    async () => {
      return [
        {
          timestamp: "12321321312321",
          amount: "123",
          transactions: {
            sendingChain: "tx",
            receivingChain: "tx",
          },
          confirmations: 8,
        },
        {
          timestamp: "12323333333",
          amount: "12",
          transactions: {
            sendingChain: "tx1",
            receivingChain: "tx1",
          },
          confirmations: 1,
        },
      ];
    },
    {
      enabled: !!chain,
    },
  );
};
