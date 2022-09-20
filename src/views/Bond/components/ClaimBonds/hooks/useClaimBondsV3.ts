import { t } from "@lingui/macro";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import { useDispatch } from "react-redux";
import { BOND_FIXED_EXPIRY_TELLER } from "src/constants/contracts";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isValidAddress } from "src/helpers/misc/isValidAddress";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { EthersError } from "src/lib/EthersTypes";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { bondNotesQueryKey } from "src/views/Bond/components/ClaimBonds/hooks/useBondNotes";
import { useAccount, useNetwork, useSigner } from "wagmi";

export const useClaimBondsV3 = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const networks = useTestableNetworks();
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: 1 } } = useNetwork();
  return useMutation<ContractReceipt, EthersError, { token: string; amount: DecimalBigNumber }>(
    async ({ token, amount }) => {
      if (!signer) throw new Error(t`Please connect a wallet to claim bonds`);
      if (chain.id !== networks.MAINNET)
        throw new Error(
          typeof token === "undefined"
            ? t`Please switch to the Ethereum network to claim all bonds`
            : t`Please switch to the Ethereum network to claim this bond`,
        );
      if (!isValidAddress(address) || !address) throw new Error(t`Invalid address`);

      const contract = BOND_FIXED_EXPIRY_TELLER.getEthersContract(networks.MAINNET).connect(signer);

      const transaction = await contract.redeem(token, amount.toBigNumber());

      return transaction.wait();
    },
    {
      onError: error => {
        dispatch(createErrorToast("error" in error ? error.error.message : error.message));
      },
      onSuccess: async (tx, { token }) => {
        trackGAEvent({
          category: "Bonds V3",
          action: "Redeem",
          label: token ?? "unknown",
          dimension1: tx.transactionHash,
          dimension2: address,
        });

        trackGtagEvent("Redeem", {
          event_category: "Bonds V3",
          event_label: token ?? "unknown",
          address: address.slice(2),
          txHash: tx.transactionHash.slice(2),
        });

        const keysToRefetch = [bondNotesQueryKey(networks.MAINNET, address)];

        const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));

        await Promise.all(promises);

        dispatch(createInfoToast(t`Claimed bond successfully`));
      },
    },
  );
};
