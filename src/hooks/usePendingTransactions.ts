import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { queryAssertion } from "src/helpers";
import { covalent } from "src/lib/covalent";
import { CovalentTransaction } from "src/lib/covalent.types";

import { useAddress } from "./useAddress";
import { useNetwork } from "./useNetwork";

export const pendingTransactionsQueryKey = (address?: string, networkId?: NetworkId) => [
  "usePendingTransactions",
  address,
  networkId,
];

export const usePendingTransactions = () => {
  const { data: address } = useAddress();
  const { data: networkId } = useNetwork();

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
