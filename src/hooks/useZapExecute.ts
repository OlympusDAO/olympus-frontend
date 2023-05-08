import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BigNumber, ContractReceipt, ethers } from "ethers";
import toast from "react-hot-toast";
import { NetworkId } from "src/constants";
import { DAO_TREASURY_ADDRESSES, GOHM_ADDRESSES, ZAP_ADDRESSES } from "src/constants/addresses";
import { SOHM_ADDRESSES } from "src/constants/addresses";
import { trackGAEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isSupportedChain } from "src/helpers/ZapHelper";
import { balanceQueryKey } from "src/hooks/useBalance";
import { warmupQueryKey } from "src/hooks/useWarmupInfo";
import { zapTokenBalancesKey } from "src/hooks/useZapTokenBalances";
import { EthersError } from "src/lib/EthersTypes";
import { Zap__factory } from "src/typechain/factories/Zap__factory";
import { useAccount, useNetwork, useSigner } from "wagmi";

interface ZapTransactionResponse {
  to: string;
  data: string;
  estimatedGas: string;
  buyAmount: string;
}

interface IUADataZap {
  address: string;
  value: string;
  token: string;
  type: string;
  slippage: string;
  approved: boolean;
}

interface ZapExecuteOptions {
  slippage: string;
  sellAmount: BigNumber;
  tokenAddress: string;
  minimumAmount: string;
  gOHM: boolean;
}

export const useZapExecute = () => {
  const client = useQueryClient();
  const { data: signer } = useSigner();
  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();

  return useMutation<ContractReceipt, EthersError, ZapExecuteOptions>(
    /**
     * Ideally the parameters to this async function should be the slippage, etc.
     * However the `mutationFn` parameter to `useMutation` accepts a function with
     * one parameter only, and it wasn't working when passing an object with a defined interface.
     * So the parameters are moved up a level.
     */
    async ({ slippage, sellAmount, tokenAddress, minimumAmount, gOHM }) => {
      if (!slippage || isNaN(Number(slippage))) throw new Error(`Slippage should be a number`);

      if (!tokenAddress) throw new Error(`The tokenAddress parameter must be set`);
      if (!signer) throw new Error(`Signer is not set`);

      const minimumAmountNumber = new DecimalBigNumber(minimumAmount);
      if (!minimumAmount || !minimumAmountNumber.gt("0")) throw new Error(`Minimum amount must be greater than 0`);

      if (!isSupportedChain(chain.id)) {
        toast.error(`Zaps are only available on Ethereum Mainnet. Please switch networks.`);
        throw new Error(`Zaps are only available on Ethereum Mainnet. Please switch networks.`);
      }

      // We only operate on Ethereum mainnet for the moment, so we can use a static contract
      const contract = Zap__factory.connect(ZAP_ADDRESSES[chain.id as keyof typeof ZAP_ADDRESSES], signer);
      if (!contract) throw new Error(`Unable to access Zap contract on network ${chain.id}`);

      const toToken = gOHM
        ? GOHM_ADDRESSES[chain.id as keyof typeof GOHM_ADDRESSES]
        : SOHM_ADDRESSES[chain.id as keyof typeof SOHM_ADDRESSES];
      if (!toToken)
        throw new Error(`Unable to fetch address for token (${gOHM ? "gOHM" : "sOHM"}) on network ${chain.id}`);

      const additionalOptions = {
        ...(tokenAddress === ethers.constants.AddressZero && { value: sellAmount }),
      };

      console.debug("Fetching token swap data from Zapper");
      if (!address) throw new Error(`Account is not set`);
      const swapData = await fetchSwapData(address, sellAmount, tokenAddress, +slippage / 100);

      console.debug("Commencing Zap");
      const transaction = await contract.ZapStake(
        tokenAddress,
        sellAmount,
        toToken,
        ethers.utils.parseUnits(minimumAmount, gOHM ? 18 : 9),
        swapData.to,
        swapData.data,
        address,
        additionalOptions,
      );

      console.debug("Awaiting transaction");
      return transaction.wait();
    },
    {
      onError: (e, variables) => {
        if (!address) throw new Error(`Account is not set`);
        const uaData: IUADataZap = {
          address,
          value: variables.sellAmount.toString(),
          token: variables.tokenAddress,
          type: "Zap Swap Failure",
          slippage: variables.slippage,
          approved: false,
        };
        trackGAEvent({
          category: "OlyZaps",
          action: uaData.type,
          metric1: parseFloat(uaData.value),
        });

        console.error(`Encountered error while executing Zap: ${e.message}`);

        if (e.message.indexOf("High Slippage") > 0) {
          toast.error(`Transaction would fail due to slippage. Please use a higher slippage tolerance value.`);
        } else if (e.message.indexOf("TRANSFER_AMOUNT_EXCEEDS_BALANCE") > 0) {
          toast.error(`Insufficient balance.`);
        } else {
          toast.error("error" in e ? e.error.message : e.message);
        }

        /**
         * NOTE: Previously, ZapSlice would re-throw the error here.
         * Re-throwing within react-query prevents the states (e.g. `isLoading`)
         * from being set correctly, so we don't do that.
         */
      },
      onSuccess: (_data, variables) => {
        console.debug("Zap successful");
        if (!address) throw new Error(`Account is not set`);
        const uaData: IUADataZap = {
          address,
          value: variables.sellAmount.toString(),
          token: variables.tokenAddress,
          type: "Zap Swap Success",
          slippage: variables.slippage,
          approved: true,
        };
        trackGAEvent({
          category: "OlyZaps",
          action: uaData.type,
          metric1: parseFloat(uaData.value),
        });
        toast.success("Successful Zap!");

        // We force a refresh of balances, but don't wait on the result
        const keysToRefetch = [
          balanceQueryKey(address, SOHM_ADDRESSES, NetworkId.MAINNET),
          balanceQueryKey(address, GOHM_ADDRESSES, NetworkId.MAINNET),
          warmupQueryKey(address, chain?.id),
          zapTokenBalancesKey(address),
        ];
        const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));
        Promise.all(promises);
      },
    },
  );
};

const fetchSwapData = async (
  address: string,
  sellAmount: BigNumber,
  tokenAddress: string,
  slippageDecimal: number,
): Promise<ZapTransactionResponse> => {
  tokenAddress = tokenAddress.toLowerCase();
  const sellToken = tokenAddress === "0x0000000000000000000000000000000000000000" ? "ETH" : tokenAddress;
  const response = await fetch(
    `https://api.0x.org/swap/v1/quote?sellToken=${sellToken}&buyToken=0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5&sellAmount=${sellAmount}&slippagePercentage=${slippageDecimal}&affiliateAddress=${
      DAO_TREASURY_ADDRESSES[NetworkId.MAINNET]
    }`,
  );
  const responseJson = await response.json();
  if (response.ok) {
    return responseJson;
  } else {
    throw Error(JSON.stringify(responseJson));
  }
};
