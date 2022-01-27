import { Contract } from "ethers";
import { useMemo } from "react";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import STAKING_ABI from "src/abi/OlympusStakingv2.json";
import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { NetworkId } from "src/constants";
import { AddressMap, STAKING_ADDRESSES } from "src/constants/addresses";
import { assert } from "src/helpers";
import { ohm_dai } from "src/helpers/AllBonds";
import { IERC20, OlympusStakingv2, PairContract } from "src/typechain";

import { useWeb3Context } from ".";

export function useContract<TContract extends Contract>(addressOrMap: string, ABI: any): TContract;
export function useContract<TContract extends Contract>(addressOrMap: AddressMap, ABI: any): TContract | null;
export function useContract<TContract extends Contract>(addressOrMap: string | AddressMap, ABI: any): TContract | null {
  const { provider, networkId } = useWeb3Context();

  return useMemo(() => {
    const address = typeof addressOrMap === "string" ? addressOrMap : addressOrMap[networkId as NetworkId];
    if (!address) return null;

    try {
      return new Contract(address, ABI, provider) as TContract;
    } catch (error) {
      console.error("Unable to get contract", error);
      return null;
    }
  }, [addressOrMap, ABI, provider, networkId]);
}

const usePairContract = (address: string) => {
  return useContract<PairContract>(address, PAIR_CONTRACT_ABI);
};

export const useStakingContract = () => {
  const address = STAKING_ADDRESSES[NetworkId.MAINNET];

  return useContract<OlympusStakingv2>(address, STAKING_ABI);
};

export const useOhmDaiReserveContract = () => {
  const address = ohm_dai.getAddressForReserve(NetworkId.MAINNET);
  assert(address, "Contract should exist for NetworkId.MAINNET");

  return usePairContract(address);
};

export const useTokenContract = (addressMap: AddressMap) => {
  return useContract<IERC20>(addressMap, IERC20_ABI);
};
