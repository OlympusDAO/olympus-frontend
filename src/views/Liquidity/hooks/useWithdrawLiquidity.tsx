import { useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { BLEVaultLido__factory, BLEVaultManagerLido__factory } from "src/typechain";
import { useMutation, useSigner } from "wagmi";

export const useWithdrawLiquidity = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ amount, slippage, address }: { amount: string; slippage: string; address: string }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = BLEVaultLido__factory.connect(address, signer);
      const vaultManagerContract = BLEVaultManagerLido__factory.connect(address, signer);

      const amountToBigNumber = ethers.utils.parseUnits(amount);

      //amount minus slippage percentage. 0.5% slippage = 0.995
      const amountLessCustomSlippage = amountToBigNumber
        .mul(ethers.BigNumber.from(100).sub(ethers.BigNumber.from(slippage)))
        .div(ethers.BigNumber.from(100));

      const protocolOut = await vaultManagerContract.callStatic.getExpectedTokensOutProtocol(amountToBigNumber);

      //TODO: need new abi for vault
      const withdrawTransaction = await contract.withdraw(
        amountToBigNumber,
        protocolOut,
        amountLessCustomSlippage,
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
