import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import { useDispatch } from "react-redux";
import { GOHM_ADDRESSES, OLD_GIVE_ADDRESSES, SOHM_ADDRESSES } from "src/constants/addresses";
import { IUARecipientData, trackGiveRedeemEvent } from "src/helpers/analytics/trackGiveRedeemEvent";
import { balanceQueryKey } from "src/hooks/useBalance";
import { useDynamicV1GiveContract } from "src/hooks/useContract";
import { recipientInfoQueryKey, redeemableBalanceQueryKey, v1RedeemableBalanceQueryKey } from "src/hooks/useGiveInfo";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { EthersError } from "src/lib/EthersTypes";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { useAccount, useNetwork } from "wagmi";
/**
 * @notice Redeems all available yield
 * @returns ContractReceipt for the redemption
 */
export const useOldRedeem = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  const networks = useTestableNetworks();
  const contract = useDynamicV1GiveContract(OLD_GIVE_ADDRESSES, true);

  return useMutation<ContractReceipt, EthersError>(
    async () => {
      if (chain.id != 1)
        throw new Error(`The old Give contract is only supported on the mainnet. Please switch to Ethereum mainnet`);

      if (!contract)
        throw new Error(
          t`Give is not supported on this network. Please switch to a supported network, such as Ethereum mainnet`,
        );

      const redeemableBalance = await contract.redeemableBalance(address);

      const uaData: IUARecipientData = {
        address: address,
        value: redeemableBalance.toString(),
        approved: true,
        txHash: null,
        type: "redeem",
      };

      // Before we submit the transaction, record the event.
      // This lets us track if the user rejects/ignores the confirmation dialog.
      trackGiveRedeemEvent(uaData, uaData.type + "-before");

      const transaction = await contract.redeem();

      uaData.txHash = transaction.hash;

      trackGiveRedeemEvent(uaData);

      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
        dispatch(createErrorToast("error" in error ? error.error.message : error.message));
      },
      onSuccess: async () => {
        const keysToRefetch = [
          balanceQueryKey(address, SOHM_ADDRESSES, networks.MAINNET),
          balanceQueryKey(address, GOHM_ADDRESSES, networks.MAINNET),
          recipientInfoQueryKey(address, networks.MAINNET),
          redeemableBalanceQueryKey(address, networks.MAINNET),
          v1RedeemableBalanceQueryKey(address, networks.MAINNET),
        ];

        keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));

        dispatch(createInfoToast(`Successfully redeemed all yield off the old contract`));
      },
    },
  );
};
