import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { queryAssertion } from "src/helpers";
import { covalent } from "src/lib/covalent";
import { CovalentTransaction } from "src/lib/covalent.types";

import { useWeb3Context } from ".";

export const pendingTransactionsQueryKey = (address?: string, networkId?: NetworkId) => [
  "usePendingTransactions",
  address,
  networkId,
];

export const usePendingTransactions = () => {
  const { address, networkId } = useWeb3Context();

  return useQuery<CovalentTransaction[], Error>(
    pendingTransactionsQueryKey(address, networkId),
    async () => {
      queryAssertion(address && networkId, pendingTransactionsQueryKey(address));

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
