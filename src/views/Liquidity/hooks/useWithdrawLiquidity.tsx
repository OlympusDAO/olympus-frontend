import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { BLEVaultLido__factory, BLEVaultManagerLido__factory } from "src/typechain";
import { useMutation, useSigner } from "wagmi";

export const useWithdrawLiquidity = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      amount,
      slippage,
      userVault,
      vaultAddress,
      pairAmountToReceive,
    }: {
      amount: string;
      slippage: string;
      userVault: string;
      vaultAddress: string;
      pairAmountToReceive: string;
    }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = BLEVaultLido__factory.connect(userVault, signer);
      const vaultManagerContract = BLEVaultManagerLido__factory.connect(vaultAddress, signer);
      const amountToBigNumber = new DecimalBigNumber(amount);
      //pairAmount is calculated based on getExpectedPairTokenOutUser.
      //This is displayed to the user prior to withdraw and slippage should be calculated on this value.
      const pairAmount = new DecimalBigNumber(pairAmountToReceive);
      //amount minus slippage percentage. 0.5% slippage = 0.995
      const slippageToPercent = 1 - +slippage / 100;
      const slippageBigNumber = new DecimalBigNumber(slippageToPercent.toString());
      const pairAmountLessCustomSlippage = pairAmount.mul(slippageBigNumber);
      const protocolOut = await vaultManagerContract.callStatic.getExpectedTokensOutProtocol(
        amountToBigNumber.toBigNumber(18),
      );

      const withdrawTransaction = await contract.withdraw(
        amountToBigNumber.toBigNumber(18),
        protocolOut,
        pairAmountLessCustomSlippage.toBigNumber(18),
        true,
      );

      const receipt = await withdrawTransaction.wait();
      return receipt;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        queryClient.invalidateQueries({ queryKey: [["useBalance"]] });
        queryClient.refetchQueries({ queryKey: ["getSingleSidedLiquidityVaults"] });
        queryClient.refetchQueries({ queryKey: ["getVault"] });
        if (tx.transactionHash) {
          trackGAEvent({
            category: "Liquidity",
            action: "Withdraw",
            dimension1: tx.transactionHash,
            dimension2: tx.from, // the signer, not necessarily the receipient
          });

          trackGtagEvent("Liquidty", {
            event_category: "Withdraw",
            address: tx.from.slice(2), // the signer, not necessarily the receipient
            txHash: tx.transactionHash.slice(2),
          });
        }

        toast(`Withdraw Successful`);
      },
    },
  );
};
