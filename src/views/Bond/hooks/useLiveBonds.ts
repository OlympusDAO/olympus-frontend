import { QueryKey, useQuery } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { OHM_ADDRESSES } from "src/constants/addresses";
import {
  BOND_AGGREGATOR_CONTRACT,
  BOND_DEPOSITORY_CONTRACT,
  OP_BOND_DEPOSITORY_CONTRACT,
} from "src/constants/contracts";
import { getQueryData } from "src/helpers/react-query/getQueryData";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { Bond, bondQueryKey, fetchBond } from "src/views/Bond/hooks/useBond";
import { bondV3QueryKey, fetchBondV3 } from "src/views/Bond/hooks/useBondV3";

export interface UseLiveBondsOptions {
  isInverseBond: boolean;
  networkId: NetworkId.MAINNET | NetworkId.TESTNET_GOERLI;
}

export const liveBondsQueryKey = (options: UseLiveBondsOptions): QueryKey => ["useLiveBonds", options];
export const liveBondsV3QueryKey = (options: UseLiveBondsOptions): QueryKey => ["useLiveBondsV3", options];

export const useLiveBonds = ({ isInverseBond = false }: { isInverseBond?: boolean } = {}) => {
  const networks = useTestableNetworks();
  const args = { networkId: networks.MAINNET, isInverseBond };
  return useQuery<Bond[], Error>([liveBondsQueryKey(args)], () => fetchLiveBonds(args));
};
export const useLiveBondsV3 = ({ isInverseBond = false }: { isInverseBond?: boolean } = {}) => {
  const networks = useTestableNetworks();
  const args = { networkId: networks.MAINNET, isInverseBond };
  return useQuery<Bond[], Error>([liveBondsV3QueryKey(args)], () => fetchLiveBondsV3(args));
};

export const fetchLiveBonds = async ({ networkId, isInverseBond }: UseLiveBondsOptions) => {
  console.debug("Fetching v2 bonds");
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

export const fetchLiveBondsV3 = async ({ networkId, isInverseBond }: UseLiveBondsOptions) => {
  const contract = BOND_AGGREGATOR_CONTRACT.getEthersContract(networkId);

  const markets = await contract
    .liveMarketsFor(OHM_ADDRESSES[networkId], isInverseBond ? false : true)
    .then(ids => ids.map(id => id.toString()));

  //Limit the number of testnet markets to last five.
  const filteredMarkets = networkId === NetworkId.TESTNET_GOERLI ? markets.slice(-5) : markets;
  const promises = await Promise.allSettled(
    filteredMarkets
      .filter(id => id !== "3") //Market 3 has a contract issue and should not be displayed
      .map(id => {
        const args = { id, isInverseBond, networkId };
        return getQueryData(bondV3QueryKey(args), () => fetchBondV3(args));
      }),
  );

  return promises
    .filter(({ status }) => status === "fulfilled")
    .map(promise => (promise as PromiseFulfilledResult<Bond>).value);
};
