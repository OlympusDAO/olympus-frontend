import { QueryKey, useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { BOND_DEPOSITORY_CONTRACT, OP_BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { getQueryData } from "src/helpers/react-query/getQueryData";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

import { Bond, bondQueryKey, fetchBond } from "./useBond";

export interface UseLiveBondsOptions {
  isInverseBond: boolean;
  networkId: NetworkId.MAINNET | NetworkId.TESTNET_RINKEBY;
}

export const liveBondsQueryKey = (options: UseLiveBondsOptions): QueryKey => ["useLiveBonds", options];

export const useLiveBonds = ({ isInverseBond = false }: { isInverseBond?: boolean } = {}) => {
  const networks = useTestableNetworks();
  const args = { networkId: networks.MAINNET, isInverseBond };
  return useQuery<Bond[], Error>(liveBondsQueryKey(args), () => fetchLiveBonds(args));
};

export const fetchLiveBonds = async ({ networkId, isInverseBond }: UseLiveBondsOptions) => {
  const contract = isInverseBond
    ? OP_BOND_DEPOSITORY_CONTRACT.getEthersContract(networkId)
    : BOND_DEPOSITORY_CONTRACT.getEthersContract(networkId);

  const markets = await contract.liveMarkets().then(ids => ids.map(id => id.toString()));

  const promises = await Promise.allSettled(
    markets.map(id => {
      const args = { id, isInverseBond, networkId };
      return getQueryData(bondQueryKey(args), () => fetchBond(args));
    }),
  );

  return promises
    .filter(({ status }) => status === "fulfilled")
    .map(promise => (promise as PromiseFulfilledResult<Bond>).value);
};
