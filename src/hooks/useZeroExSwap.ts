import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BigNumber, ContractReceipt } from "ethers";
import toast from "react-hot-toast";
import { NetworkId } from "src/constants";
import { DAO_TREASURY_ADDRESSES, GOHM_ADDRESSES } from "src/constants/addresses";
import { SOHM_ADDRESSES } from "src/constants/addresses";
import { trackGAEvent } from "src/helpers/analytics/trackGAEvent";
import { balanceQueryKey } from "src/hooks/useBalance";
import { zapTokenBalancesKey } from "src/hooks/useZapTokenBalances";
import { EthersError } from "src/lib/EthersTypes";
import { useAccount, useSigner } from "wagmi";

interface ZapTransactionResponse {
  to: string;
  data: string;
  estimatedGas: string;
  buyAmount: string;
  gasPrice: string;
  value: string;
  sellAmount: string;
  gas: string;
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
  buyAddress: string;
}

export const useZeroExSwap = () => {
  const client = useQueryClient();
  const { data: signer } = useSigner();
  const { address = "" } = useAccount();

  return useMutation<ContractReceipt, EthersError, ZapExecuteOptions>(
    /**
     * Ideally the parameters to this async function should be the slippage, etc.
     * However the `mutationFn` parameter to `useMutation` accepts a function with
     * one parameter only, and it wasn't working when passing an object with a defined interface.
     * So the parameters are moved up a level.
     */
    async ({ slippage, sellAmount, tokenAddress, buyAddress }) => {
      if (!slippage || isNaN(Number(slippage))) throw new Error(`Slippage should be a number`);

      if (!tokenAddress) throw new Error(`The tokenAddress parameter must be set`);
      if (!signer) throw new Error(`Signer is not set`);

      if (!address) throw new Error(`Account is not set`);
      const swapData = await fetchSwapData(sellAmount, tokenAddress, +slippage / 100, buyAddress, true, address);

      console.debug("Commencing Zap");

      //see https://docs.0x.org/0x-api-swap/guides/swap-tokens-with-0x-api#ethers.js
      //https://github.com/0xProject/0x-api-starter-guide-code/blob/master/src/direct-swap.js#L105-L113
      const payload = {
        from: address,
        to: swapData.to,
        data: swapData.data,
        value: swapData.value,
        gasPrice: swapData.gasPrice,
        gasLimit: swapData.gas,
      };

      const transaction = await signer.sendTransaction(payload);

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
        console.debug("Swap successful");
        if (!address) throw new Error(`Account is not set`);
        const uaData: IUADataZap = {
          address,
          value: variables.sellAmount.toString(),
          token: variables.tokenAddress,
          type: "Swap Success",
          slippage: variables.slippage,
          approved: true,
        };
        trackGAEvent({
          category: "0XSwap",
          action: uaData.type,
          metric1: parseFloat(uaData.value),
        });
        toast.success("Successful Swap!");

        // We force a refresh of balances, but don't wait on the result
        const keysToRefetch = [
          balanceQueryKey(address, SOHM_ADDRESSES, NetworkId.MAINNET),
          balanceQueryKey(address, GOHM_ADDRESSES, NetworkId.MAINNET),
          zapTokenBalancesKey(address),
        ];
        const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));
        Promise.all(promises);
      },
    },
  );
};

export const fetchSwapData = async (
  amount: BigNumber,
  tokenAddress: string,
  slippageDecimal: number,
  buyAddress: string,
  isSell = true,
  userAddress?: `0x${string}` | undefined,
): Promise<ZapTransactionResponse> => {
  tokenAddress = tokenAddress.toLowerCase();
  const sellToken = tokenAddress === "0x0000000000000000000000000000000000000000" ? "ETH" : tokenAddress;
  //This is important to get an accurate gas price at time of transaction.
  //https://docs.0x.org/~/changes/PCjEyAi54cQNhYQqyeuy/developer-resources/faqs-and-troubleshooting#how-does-takeraddress-help-with-catching-issues
  //If we pass this takerAddress prior to approvals, the quote will return an error. Only pass it when about to swap
  const takerAddress = userAddress ? `&takerAddress=${userAddress}` : "";
  //TODO: swap for mainnet
  const response = await fetch(
    `https://api.0x.org/swap/v1/quote?sellToken=${sellToken}&buyToken=${buyAddress}&${
      isSell ? `sellAmount` : `buyAmount`
    }=${amount}&slippagePercentage=${slippageDecimal}&enableSlippageProtection=true${takerAddress}&affiliateAddress=${
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
