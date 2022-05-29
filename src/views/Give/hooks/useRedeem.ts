import { t } from "@lingui/macro";
import { ContractReceipt } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { GIVE_ADDRESSES, GOHM_ADDRESSES, SOHM_ADDRESSES } from "src/constants/addresses";
import { IUARecipientData, trackGiveRedeemEvent } from "src/helpers/analytics/trackGiveRedeemEvent";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { balanceQueryKey } from "src/hooks/useBalance";
import { useDynamicGiveContract } from "src/hooks/useContract";
import { recipientInfoQueryKey, redeemableBalanceQueryKey } from "src/hooks/useGiveInfo";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { useAccount } from "wagmi";

import { RedeemData } from "../Interfaces";

/**
 * @notice Redeems all available yield
 * @returns ContractReceipt for the redemption
 */
export const useRedeem = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { data: account } = useAccount();
  const networks = useTestableNetworks();
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);

  return useMutation<ContractReceipt, Error, RedeemData>(
    async ({ token: token_ }) => {
      if (!contract)
        throw new Error(
          t`Give is not supported on this network. Please switch to a supported network, such as Ethereum mainnet`,
        );
      if (!account?.address) throw new Error(t`Please refresh your page and try again`);

      const redeemableBalance = await contract.totalRedeemableBalance(account.address);

      const uaData: IUARecipientData = {
        address: account.address,
        value: redeemableBalance.toString(),
        approved: true,
        txHash: null,
        type: "redeem",
      };

      // Before we submit the transaction, record the event.
      // This lets us track if the user rejects/ignores the confirmation dialog.
      trackGiveRedeemEvent(uaData, uaData.type + "-before");

      const transaction = token_ === "sOHM" ? await contract.redeemAllYieldAsSohm() : await contract.redeemAllYield();

      uaData.txHash = transaction.hash;

      trackGiveRedeemEvent(uaData);

      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async () => {
        queryAssertion(account?.address);
        const keysToRefetch = [
          balanceQueryKey(account.address, SOHM_ADDRESSES, networks.MAINNET),
          balanceQueryKey(account.address, GOHM_ADDRESSES, networks.MAINNET),
          recipientInfoQueryKey(account.address, networks.MAINNET),
          redeemableBalanceQueryKey(account.address, networks.MAINNET),
        ];

        keysToRefetch.map(key => client.refetchQueries(key, { active: true }));

        dispatch(createInfoToast(t`Successfully redeemed all available yield`));
      },
    },
  );
};
