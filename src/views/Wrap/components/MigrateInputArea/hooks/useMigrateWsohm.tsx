import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import { useDispatch } from "react-redux";
import { GOHM_ADDRESSES, MIGRATOR_ADDRESSES, WSOHM_ADDRESSES } from "src/constants/addresses";
import { trackGAEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { balanceQueryKey, useBalance } from "src/hooks/useBalance";
import { useDynamicMigratorContract } from "src/hooks/useContract";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { EthersError } from "src/lib/EthersTypes";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { useAccount, useNetwork } from "wagmi";
export const useMigrateWsohm = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const networks = useTestableNetworks();
  const balances = useBalance(WSOHM_ADDRESSES);

  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();

  const contract = useDynamicMigratorContract(MIGRATOR_ADDRESSES, true);

  return useMutation<ContractReceipt, EthersError, string>(
    async amount => {
      if (!amount || isNaN(Number(amount))) throw new Error(`Please enter a number`);

      const _amount = new DecimalBigNumber(amount, 18);

      if (!_amount.gt("0")) throw new Error(`Please enter a number greater than 0`);

      if (!contract || (chain.id !== networks.AVALANCHE && chain.id !== networks.ARBITRUM))
        throw new Error(`Please switch to the Abritrum or Avalanche networks to migrate`);

      const balance = balances[chain.id].data;

      if (!balance) throw new Error(`Please refresh your page and try again`);

      if (_amount.gt(balance)) throw new Error(`You cannot migrate more than your wsOHM balance`);

      const transaction = await contract.migrate(_amount.toBigNumber());
      return transaction.wait();
    },
    {
      onError: error => {
        dispatch(createErrorToast("error" in error ? error.error.message : error.message));
      },
      onSuccess: async (_, amount) => {
        trackGAEvent({
          category: "Migration",
          action: "Migrate wsOHM",
          value: new DecimalBigNumber(amount, 18).toApproxNumber(),
        });

        const keysToRefetch = [
          balanceQueryKey(address, WSOHM_ADDRESSES, chain.id),
          balanceQueryKey(address, GOHM_ADDRESSES, chain.id),
        ];

        const promises = keysToRefetch.map(key => client.refetchQueries([key], { type: "active" }));

        await Promise.all(promises);

        dispatch(createInfoToast(`Successfully migrated from wsOHM to gOHM`));
      },
    },
  );
};
