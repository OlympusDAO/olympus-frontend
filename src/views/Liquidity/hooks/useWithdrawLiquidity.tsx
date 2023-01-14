import { ethers } from "ethers";
import toast from "react-hot-toast";
import { STETH_LIQUIDITY_AMO_CONTRACT } from "src/constants/contracts";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useMutation, useSigner } from "wagmi";

export const useWithdrawLiquidity = () => {
  const networks = useTestableNetworks();
  const { data: signer } = useSigner();
  if (!signer) throw new Error(`Please connect a wallet`);
  return useMutation(
    async ({ amount, slippage }: { amount: string; slippage: string }) => {
      const contract = STETH_LIQUIDITY_AMO_CONTRACT.getEthersContract(networks.MAINNET).connect(signer);
      //TODO: Number of Decimals
      const amountToBigNumber = ethers.utils.parseUnits(amount);
      //TODO: How to calculate slippage? Need Price feed that contract is using for LP price.
      const minPairToken = 1;
      const minOhmToken = 1;
      const minPairTokenBigNumber = ethers.utils.parseUnits(minPairToken.toString());
      const minOhmTokenBigNumber = ethers.utils.parseUnits(minOhmToken.toString());

      //TODO: Should claim always be set to true?
      const withdrawTransaction = await contract.withdraw(
        amountToBigNumber,
        [minPairTokenBigNumber, minOhmTokenBigNumber],
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
