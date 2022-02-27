import { t } from "@lingui/macro";
import { ContractReceipt } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { GOHM_ADDRESSES, MIGRATOR_ADDRESSES, WSOHM_ADDRESSES } from "src/constants/addresses";
import { useWeb3Context } from "src/hooks";
import { balanceQueryKey, useBalance } from "src/hooks/useBalance";
import { useDynamicMigratorContract } from "src/hooks/useContract";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";

export const useMigrateWsohm = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const networks = useTestableNetworks();
  const balances = useBalance(WSOHM_ADDRESSES);
  const { address, networkId } = useWeb3Context();
  const contract = useDynamicMigratorContract(MIGRATOR_ADDRESSES, true);

  return useMutation<ContractReceipt, Error>(
    async () => {
      if (!contract || (networkId !== networks.AVALANCHE && networkId !== networks.ARBITRUM))
        throw new Error(t`Please switch to the Abritrum or Avalanche networks to migrate`);

      const balance = balances[networkId].data;

      if (!balance) throw new Error(t`Please refresh your page and try again`);
      if (balance.eq(0)) throw new Error(t`You have already migrated all of your wsOHM`);

      const transaction = await contract.migrate(balance);
      return transaction.wait();
    },
    {
      onError: error => {
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async () => {
        const keysToRefetch = [
          balanceQueryKey(address, WSOHM_ADDRESSES, networkId),
          balanceQueryKey(address, GOHM_ADDRESSES, networkId),
        ];

        const promises = keysToRefetch.map(key => client.refetchQueries(key, { active: true }));

        await Promise.all(promises);

        dispatch(createInfoToast(t`Successfully migrated from wsOHM to gOHM`));
      },
    },
  );
};
