import { Contract } from "ethers";
import { useWeb3Context } from ".";
import { useNetwork } from "./useNetwork";
import OLYMPUS_STAKING_ABI from "src/abi/OlympusStakingv2.json";
import { AddressMap, STAKING_ADDRESSES } from "src/constants/addresses";
import { OlympusStaking } from "src/typechain";
import { useMemo } from "react";
import { NetworkId } from "src/constants";

export function useContract<TContract extends Contract = Contract>(addressOrAddressMap: string, ABI: any): TContract;
export function useContract<TContract extends Contract = Contract>(
  addressOrAddressMap: AddressMap,
  ABI: any,
): TContract | null;
export function useContract<TContract extends Contract = Contract>(
  addressOrAddressMap: string | AddressMap,
  ABI: any,
): TContract | null {
  const { provider } = useWeb3Context();
  const { data: networkId } = useNetwork();

  return useMemo(() => {
    const address = typeof addressOrAddressMap === "string" ? addressOrAddressMap : addressOrAddressMap[networkId!];
    if (!address) return null;

    try {
      return new Contract(address, ABI, provider) as TContract;
    } catch (error) {
      console.error("Unable to get contract", error);
      return null;
    }
  }, [addressOrAddressMap, ABI, provider, networkId]);
}

export const useStakingContract = () => {
  return useContract<OlympusStaking>(STAKING_ADDRESSES[NetworkId.MAINNET]!, OLYMPUS_STAKING_ABI);
};
