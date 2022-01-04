import { Contract } from "ethers";
import { useWeb3Context } from ".";
import { useNetwork } from "./useNetwork";
import OLYMPUS_STAKING_ABI from "src/abi/OlympusStakingv2.json";
import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { AddressMap, STAKING_ADDRESSES } from "src/constants/addresses";
import { OlympusStaking, PairContract } from "src/typechain";
import { useMemo } from "react";
import { NetworkId } from "src/constants";
import { ohm_dai } from "src/helpers/AllBonds";
import { assert } from "src/helpers";

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

const usePairContract = (address: string) => {
  return useContract<PairContract>(address, PAIR_CONTRACT_ABI);
};

export const useStakingContract = () => {
  const address = STAKING_ADDRESSES[NetworkId.MAINNET];
  assert(address, "Contract should exist for NetworkId.MAINNET");
  return useContract<OlympusStaking>(address, OLYMPUS_STAKING_ABI);
};

export const useOhmDaiReserveContract = () => {
  const address = ohm_dai.getAddressForReserve(NetworkId.MAINNET);
  assert(address, "Contract should exist for NetworkId.MAINNET");
  return usePairContract(address);
};
