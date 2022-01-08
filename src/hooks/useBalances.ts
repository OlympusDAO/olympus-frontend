import { useQuery } from "react-query";
import {
  AddressMap,
  GOHM_ADDRESSES,
  OHM_ADDRESS,
  SOHM_ADDRESS,
  V1_OHM_ADDRESS,
  V1_SOHM_ADDRESS,
  WSOHM_ADDRESSES,
} from "src/constants/addresses";
import { useAddress } from "./useAddress";
import { queryAssertion } from "src/helpers";
import { covalent } from "src/lib/covalent";
import { formatUnits } from "@ethersproject/units";
import { TokenBalance } from "src/lib/covalent.types";

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
  return useBalances<Record<keyof typeof addressMap, number>>(balances => {
    return unstable_Object.keys(addressMap).reduce((prev, networkId) => {
      // Assign and return 0 if covalent doesn't support this networkId
      if (!balances.hasOwnProperty(networkId)) {
        prev[networkId] = 0;
        return prev;
      }

      const tokenAddress = addressMap[networkId]!;
      const tokens = balances[networkId as keyof typeof covalent.SUPPORTED_NETWORKS];
      const token = tokens.find(token => token.contract_address.toLowerCase() === tokenAddress.toLowerCase());

      prev[networkId] = token ? parseFloat(formatUnits(token.balance, token.contract_decimals)) : 0;

      return prev;
    }, {} as Record<keyof typeof addressMap, number>);
  });
};

export const useOhmBalance = () => useBalance(OHM_ADDRESS);
export const useSohmBalance = () => useBalance(SOHM_ADDRESS);
export const useGohmBalance = () => useBalance(GOHM_ADDRESSES);
export const useV1OhmBalance = () => useBalance(V1_OHM_ADDRESS);
export const useWsohmBalance = () => useBalance(WSOHM_ADDRESSES);
export const useV1SohmBalance = () => useBalance(V1_SOHM_ADDRESS);
