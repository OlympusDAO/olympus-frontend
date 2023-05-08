import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import toast from "react-hot-toast";
import { OHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { balanceQueryKey } from "src/hooks/useBalance";
import { useDynamicStakingContract } from "src/hooks/useContract";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useWarmupClaim, warmupQueryKey } from "src/hooks/useWarmupInfo";
import { EthersError } from "src/lib/EthersTypes";
import { useAccount } from "wagmi";

/**
 * when warmup is on, useClaimToken claims the user's stake that has been warmed up
 */
export const useForfeitToken = () => {
  const client = useQueryClient();
  const { address = "" } = useAccount();
  const networks = useTestableNetworks();
  const { data: claim } = useWarmupClaim();
  const claimBalance = claim?.sohm;
  const contract = useDynamicStakingContract(STAKING_ADDRESSES, true);

  return useMutation<ContractReceipt, EthersError>({
    mutationFn: async () => {
      if (!claimBalance) throw new Error(`Please refresh your page and try again`);

      if (!contract) throw new Error(`Please switch to the Ethereum network to forfeit your warmup`);

      if (!address) throw new Error(`Please refresh your page and try again`);

      const transaction = await contract.forfeit();
      return transaction.wait();
    },
    onError: error => {
      toast.error("error" in error ? error.error.message : error.message);
    },
    onSuccess: async (tx, data) => {
      const keysToRefetch = [
        balanceQueryKey(address, OHM_ADDRESSES, networks.MAINNET),
        warmupQueryKey(address, networks.MAINNET),
      ];

      const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));

      await Promise.all(promises);

      toast(`Successfully forfeited warmed-up balance`);

      trackGAEvent({
        category: "Staking",
        action: "forfeit",
        label: `Forfeit Staking`,
        // value: new DecimalBigNumber(data.amount, 9).toApproxNumber(),
        dimension1: tx.transactionHash,
        dimension2: address,
      });

      trackGtagEvent("Forfeit Test 2", {
        event_category: "Forfeiting",
        // value: new DecimalBigNumber(data.amount, 9).toApproxNumber(),
        address: address.slice(2),
        txHash: tx.transactionHash.slice(2),
      });
    },
  });
};
