import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BigNumber, Contract, ContractReceipt } from "ethers";
import RewardDistributorABI from "src/abi/RewardDistributor.json";
import { DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES } from "src/constants/addresses";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { EthersError } from "src/lib/EthersTypes";
import { NetworkId } from "src/networkDetails";
import { useAccount, useNetwork, useSigner } from "wagmi";

interface ClaimRewardsParams {
  epochEndDates: number[];
  amounts: string[];
  proofs: string[][];
  asVaultToken: boolean;
}

export const useClaimRewards = () => {
  const client = useQueryClient();
  const { address } = useAccount();
  const { chain = { id: 11155111 } } = useNetwork();
  const { data: signer } = useSigner();
  const networkId = chain.id as NetworkId;

  const contractAddress =
    DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES[networkId as keyof typeof DEPOSIT_REWARDS_DISTRIBUTOR_ADDRESSES];

  return useMutation<ContractReceipt, EthersError, ClaimRewardsParams>({
    mutationFn: async ({ epochEndDates, amounts, proofs, asVaultToken }) => {
      try {
        if (!address) throw new Error("Please connect your wallet");
        if (!contractAddress) throw new Error("Rewards distributor not available on this network");
        if (!signer) throw new Error("Please connect your wallet to sign the transaction");

        // Validate inputs
        if (epochEndDates.length === 0) throw new Error("No epochs specified for claim");
        if (epochEndDates.length !== amounts.length || epochEndDates.length !== proofs.length) {
          throw new Error("Invalid claim data: arrays length mismatch");
        }

        // Create contract with signer
        const provider = Providers.getStaticProvider(networkId);
        const contract = new Contract(contractAddress, RewardDistributorABI, signer || provider);

        // Amounts are already in wei from the API, just convert to BigNumber
        const amountsBigNumber = amounts.map(amount => BigNumber.from(amount));

        // Call claim function on the contract
        const transaction = await contract.claim(epochEndDates, amountsBigNumber, proofs, asVaultToken);

        // Wait for transaction to be mined
        const receipt = await transaction.wait();

        // Invalidate queries to refresh data
        await client.invalidateQueries(["hasClaimed"]);
        await client.invalidateQueries(["userHistory"]);
        await client.invalidateQueries(["userUnits"]);

        return receipt;
      } catch (error) {
        console.error("Claim error:", error);
        throw error;
      }
    },
  });
};
