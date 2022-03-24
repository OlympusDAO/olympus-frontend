import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";
import { covalent } from "src/lib/covalent";
import { CovalentTransaction } from "src/lib/covalent.types";

import { useWeb3Context } from ".";

export const pendingTransactionsQueryKey = (address?: string, networkId?: NetworkId) =>
  ["usePendingTransactions", address, networkId].filter(nonNullable);

export const usePendingTransactions = () => {
  const { address, networkId } = useWeb3Context();

  const key = pendingTransactionsQueryKey(address, networkId);
  return useQuery<CovalentTransaction[], Error>(
    key,
    async () => {
      queryAssertion(address && networkId, key);

      if (!covalent.isSupportedNetwork(networkId)) return [];

      const transactions = await covalent.transactions.getAllForAddress(
        address,
        networkId as keyof typeof covalent.SUPPORTED_NETWORKS,
      );

      return transactions.filter(transaction => !transaction.successful);
    },
    { enabled: !!address && !!networkId },
  );
};
