import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { isValidAddress } from "src/helpers/misc/isValidAddress";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { EthersError } from "src/lib/EthersTypes";
import { bondNotesQueryKey } from "src/views/Bond/components/ClaimBonds/hooks/useBondNotes";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const useClaimBonds = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const networks = useTestableNetworks();
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: 1 } } = useNetwork();
  return useMutation<ContractReceipt, EthersError, { id?: string; isPayoutGohm: boolean }>(
    async ({ id, isPayoutGohm }) => {
      if (!signer) throw new Error(`Please connect a wallet to claim bonds`);
      if (chain.id !== networks.MAINNET)
        throw new Error(
          typeof id === "undefined"
            ? `Please switch to the Ethereum network to claim all bonds`
            : `Please switch to the Ethereum network to claim this bond`,
        );
      if (!isValidAddress(address) || !address) throw new Error(`Invalid address`);

      const contract = BOND_DEPOSITORY_CONTRACT.getEthersContract(networks.MAINNET).connect(signer);

      if (id) {
        const transaction = await contract.redeem(address, [id], isPayoutGohm);
        return transaction.wait();
      }

      const transaction = await contract.redeemAll(address, isPayoutGohm);
      return transaction.wait();
    },
    {
      onError: error => {
        toast.error("error" in error ? error.error.message : error.message);
      },
      onSuccess: async (tx, { id }) => {
        trackGAEvent({
          category: "Bonds",
          action: "Redeem",
          label: id ?? "unknown",
          dimension1: tx.transactionHash,
          dimension2: address,
        });

        trackGtagEvent("Redeem", {
          event_category: "Bonds",
          event_label: id ?? "unknown",
          address: address.slice(2),
          txHash: tx.transactionHash.slice(2),
        });

        const keysToRefetch = [bondNotesQueryKey(networks.MAINNET, address)];

        const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));

        await Promise.all(promises);
        toast(typeof id === "undefined" ? `Claimed all bonds successfully` : `Claimed bond successfully`);
      },
    },
  );
};
