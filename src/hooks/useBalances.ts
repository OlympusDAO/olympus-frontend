import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";
import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import {
  AddressMap,
  FUSE_POOL_6_ADDRESSES,
  FUSE_POOL_18_ADDRESSES,
  FUSE_POOL_36_ADDRESSES,
  GOHM_ADDRESSES,
  GOHM_TOKEMAK_ADDRESSES,
  OHM_ADDRESSES,
  SOHM_ADDRESSES,
  V1_OHM_ADDRESSES,
  V1_SOHM_ADDRESSES,
  WSOHM_ADDRESSES,
} from "src/constants/addresses";
import { assert, queryAssertion } from "src/helpers";
import { covalent } from "src/lib/covalent";
import { CovalentTokenBalance } from "src/lib/covalent.types";

import { useWeb3Context } from ".";
import { useFuseContract } from "./useContract";

const unstable_Object = Object as unstable_ObjectConstructor;

type Balances = Record<keyof typeof covalent.SUPPORTED_NETWORKS, CovalentTokenBalance[]>;

export const balancesQueryKey = (address?: string) => ["useBalances", address];
export const useBalances = <TSelectData = unknown>(select: (data: Balances) => TSelectData) => {
  const { address } = useWeb3Context();

  return useQuery<Balances, Error, TSelectData>(
    balancesQueryKey(address),
    async () => {
      queryAssertion(address, balancesQueryKey());

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

const getBalance = (balances: Balances, addressMap: AddressMap, networkId: NetworkId) => {
  if (!covalent.isSupportedNetwork(networkId)) return BigNumber.from(0);

  const covalentTokens = balances[networkId as keyof typeof covalent.SUPPORTED_NETWORKS];
  const tokenAddress = addressMap[networkId];

  assert(tokenAddress, "addressMap[networkId] should always exist");

  const token = covalentTokens.find(token => token.contract_address.toLowerCase() === tokenAddress.toLowerCase());

  return token ? parseUnits(token.balance, token.contract_decimals) : BigNumber.from(0);
};

const selectBalance = <TAddressMap extends AddressMap>(addressMap: TAddressMap) => {
  return (balances: Balances) => {
    return unstable_Object
      .keys(addressMap)
      .reduce(
        (prev, networkId) => Object.assign(prev, { [networkId]: getBalance(balances, addressMap, networkId) }),
        {} as Record<keyof typeof addressMap, BigNumber>,
      );
  };
};
/**
 * Returns a balance.
 * @param addressMap Address map of the token you want the balance of.
 */
export const useBalance = <TAddressMap extends AddressMap = AddressMap>(addressMap: TAddressMap) => {
  return useBalances<Record<keyof typeof addressMap, BigNumber>>(selectBalance(addressMap));
};

export const useOhmBalance = () => useBalance(OHM_ADDRESSES);
export const useSohmBalance = () => useBalance(SOHM_ADDRESSES);
export const useGohmBalance = () => useBalance(GOHM_ADDRESSES);
export const useWsohmBalance = () => useBalance(WSOHM_ADDRESSES);
export const useV1OhmBalance = () => useBalance(V1_OHM_ADDRESSES);
export const useV1SohmBalance = () => useBalance(V1_SOHM_ADDRESSES);
export const useGohmTokemakBalance = () => useBalance(GOHM_TOKEMAK_ADDRESSES);

/**
 * Returns a balance for the connected network.
 * @param addressMap Address map of the token you want the balance of.
 */
export const useWalletBalanceData = <TAddressMap extends AddressMap = AddressMap>(addressMap: TAddressMap) => {
  const { networkId } = useWeb3Context();
  return useBalances<BigNumber>((balances: Balances) => {
    const balance = selectBalance(addressMap)(balances);
    console.log(balance);
    if (Object.prototype.hasOwnProperty.call(balance, networkId)) {
      // @ts-ignore
      return balance[networkId];
    }
    const error = "`The balance cannot be fetched for this network (${networkId})`";
    console.error(error);
    // NOTE: should we throw an error? Show an onscreen message?
    return 0;
  });
};
export const useSohmWalletBalanceData = () => useWalletBalanceData(SOHM_ADDRESSES);
export const useGohmWalletBalanceData = () => useWalletBalanceData(GOHM_ADDRESSES);

/**
 * Returns gOHM balance in Fuse
 */
export const fuseBalanceQueryKey = (address: string) => ["useFuseBalance", address];
export const useFuseBalance = () => {
  const { address } = useWeb3Context();
  const pool6Contract = useFuseContract(FUSE_POOL_6_ADDRESSES);
  const pool18Contract = useFuseContract(FUSE_POOL_18_ADDRESSES);
  const pool36Contract = useFuseContract(FUSE_POOL_36_ADDRESSES);

  return useQuery<BigNumber, Error>(
    fuseBalanceQueryKey(address),
    async () => {
      queryAssertion(address, fuseBalanceQueryKey(address));

      const promises = [pool6Contract, pool18Contract, pool36Contract].map(async contract => {
        return contract.callStatic.balanceOfUnderlying(address);
      });

      const results = await Promise.all(promises);

      return results.reduce((prev, bal) => prev.add(bal), BigNumber.from(0));
    },
    { enabled: !!address },
  );
};
