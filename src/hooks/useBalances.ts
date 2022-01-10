import { useQuery } from "react-query";
import {
  AddressMap,
  GOHM_ADDRESSES,
  OHM_ADDRESSES,
  SOHM_ADDRESSES,
  V1_OHM_ADDRESSES,
  V1_SOHM_ADDRESSES,
  WSOHM_ADDRESSES,
} from "src/constants/addresses";
import { useAddress } from "./useAddress";
import { queryAssertion } from "src/helpers";
import { covalent } from "src/lib/covalent";
import { TokenBalance } from "src/lib/covalent.types";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";

const unstable_Object = Object as unstable_ObjectConstructor;

type Balances = Record<keyof typeof covalent.SUPPORTED_NETWORKS, TokenBalance[]>;

export const useBalancesKey = (address?: string) => ["useBalances", address];

export const useBalances = <TSelectData = unknown>(select: (data: Balances) => TSelectData) => {
  const { data: address } = useAddress();

  return useQuery<Balances, Error, TSelectData>(
    useBalancesKey(address),
    async () => {
      queryAssertion(address, useBalancesKey());

      // Map all networkId's to a promise that resolves to a list of all token balances
      const promises = unstable_Object
        .keys(covalent.SUPPORTED_NETWORKS)
        .map(networkId => covalent.balances.getAllTokens(address, networkId));

      // Run all requests in parallel
      const responses = await Promise.all(promises);

      // Convert array of reponses back to a single object
      return unstable_Object
        .keys(covalent.SUPPORTED_NETWORKS)
        .reduce((prev, networkId, index) => Object.assign(prev, { [networkId]: responses[index] }), {} as Balances);
    },
    { enabled: !!address, select },
  );
};

/**
 * Returns a balance.
 * @param addressMap Address map of the token you want the balance of.
 */
const useBalance = <TAddressMap extends AddressMap = AddressMap>(addressMap: TAddressMap) => {
  return useBalances<Record<keyof typeof addressMap, BigNumber>>(balances => {
    return unstable_Object.keys(addressMap).reduce((prev, networkId) => {
      // Assign and return 0 if covalent doesn't support this networkId
      if (!balances.hasOwnProperty(networkId)) {
        prev[networkId] = BigNumber.from(0);
        return prev;
      }

      const tokenAddress = addressMap[networkId]!;
      const tokens = balances[networkId as keyof typeof covalent.SUPPORTED_NETWORKS];
      const token = tokens.find(token => token.contract_address.toLowerCase() === tokenAddress.toLowerCase());

      prev[networkId] = token ? parseUnits(token.balance, token.contract_decimals) : BigNumber.from(0);

      return prev;
    }, {} as Record<keyof typeof addressMap, BigNumber>);
  });
};

export const useOhmBalance = () => useBalance(OHM_ADDRESSES);
export const useSohmBalance = () => useBalance(SOHM_ADDRESSES);
export const useGohmBalance = () => useBalance(GOHM_ADDRESSES);
export const useWsohmBalance = () => useBalance(WSOHM_ADDRESSES);
export const useV1OhmBalance = () => useBalance(V1_OHM_ADDRESSES);
export const useV1SohmBalance = () => useBalance(V1_SOHM_ADDRESSES);
