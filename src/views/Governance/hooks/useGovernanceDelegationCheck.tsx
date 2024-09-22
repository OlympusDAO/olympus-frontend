import { GOHM_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useCheckDelegation } from "src/views/Governance/hooks/useCheckDelegation";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { useAccount, useBalance } from "wagmi";

export const useGovernanceDelegationCheck = () => {
  const { address } = useAccount();
  const networks = useTestableNetworks();

  const { data: clearingHouseV1 } = useGetClearingHouse({ clearingHouse: "clearingHouseV1" });
  const { data: clearingHouseV2 } = useGetClearingHouse({ clearingHouse: "clearingHouseV2" });
  const { data: coolerAddressV1 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouseV1?.factory,
    collateralAddress: clearingHouseV1?.collateralAddress,
    debtAddress: clearingHouseV1?.debtAddress,
    clearingHouseVersion: "clearingHouseV1",
  });
  const { data: coolerAddressV2 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouseV2?.factory,
    collateralAddress: clearingHouseV2?.collateralAddress,
    debtAddress: clearingHouseV2?.debtAddress,
    clearingHouseVersion: "clearingHouseV2",
  });
  const { data: gOHMDelegationAddress } = useCheckDelegation({ address });
  const { data: coolerV1DelegationAddress } = useCheckDelegation({ address: coolerAddressV1 });
  const { data: coolerV2DelegationAddress } = useCheckDelegation({ address: coolerAddressV2 });

  const { data: gohmCoolerV2Balance } = useBalance({
    address: coolerAddressV2 as `0x${string}`,
    token: GOHM_ADDRESSES[networks.MAINNET] as `0x${string}`,
  });
  const { data: gohmCoolerV1Balance } = useBalance({
    address: coolerAddressV1 as `0x${string}`,
    token: GOHM_ADDRESSES[networks.MAINNET] as `0x${string}`,
  });
  const { data: gohmBalance } = useBalance({
    address: address as `0x${string}`,
    token: GOHM_ADDRESSES[networks.MAINNET] as `0x${string}`,
  });
  return {
    gOHMDelegationAddress,
    coolerV1DelegationAddress,
    coolerV2DelegationAddress,
    gohmBalance,
    gohmCoolerV1Balance,
    gohmCoolerV2Balance,
    coolerAddressV1,
    coolerAddressV2,
  };
};
