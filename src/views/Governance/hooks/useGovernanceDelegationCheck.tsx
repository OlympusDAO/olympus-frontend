import { GOHM_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useCheckDelegation } from "src/views/Governance/hooks/useCheckDelegation";
import { useGetClearingHouse } from "src/views/Lending/Cooler/hooks/useGetClearingHouse";
import { useGetCoolerForWallet } from "src/views/Lending/Cooler/hooks/useGetCoolerForWallet";
import { useMonoCoolerDelegations } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerDelegations";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";
import { useAccount, useBalance } from "wagmi";

export const useGovernanceDelegationCheck = () => {
  const { address } = useAccount();
  const networks = useTestableNetworks();

  const { data: clearingHouseV1 } = useGetClearingHouse({ clearingHouse: "clearingHouseV1" });
  const { data: clearingHouseV2 } = useGetClearingHouse({ clearingHouse: "clearingHouseV2" });
  const { data: clearingHouseV3 } = useGetClearingHouse({ clearingHouse: "clearingHouseV3" });
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
  const { data: coolerAddressV3 } = useGetCoolerForWallet({
    walletAddress: address,
    factoryAddress: clearingHouseV3?.factory,
    collateralAddress: clearingHouseV3?.collateralAddress,
    debtAddress: clearingHouseV3?.debtAddress,
    clearingHouseVersion: "clearingHouseV3",
  });

  // Get Cooler V2 position and delegations
  const { data: position } = useMonoCoolerPosition();
  const { delegations } = useMonoCoolerDelegations();
  const hasCoolerV2Delegations = delegations.data && delegations.data.length > 0;

  const { data: gOHMDelegationAddress } = useCheckDelegation({ address });
  const { data: coolerV1ClearingHouseDelegationAddress } = useCheckDelegation({ address: coolerAddressV1 });
  const { data: coolerV2ClearingHouseDelegationAddress } = useCheckDelegation({ address: coolerAddressV2 });
  const { data: coolerV3ClearingHouseDelegationAddress } = useCheckDelegation({ address: coolerAddressV3 });

  const { data: gohmCoolerV2ClearingHouseBalance } = useBalance({
    address: coolerAddressV2 as `0x${string}`,
    token: GOHM_ADDRESSES[networks.MAINNET] as `0x${string}`,
  });
  const { data: gohmCoolerV1ClearingHouseBalance } = useBalance({
    address: coolerAddressV1 as `0x${string}`,
    token: GOHM_ADDRESSES[networks.MAINNET] as `0x${string}`,
  });
  const { data: gohmCoolerV3ClearingHouseBalance } = useBalance({
    address: coolerAddressV3 as `0x${string}`,
    token: GOHM_ADDRESSES[networks.MAINNET] as `0x${string}`,
  });
  const { data: gohmBalance } = useBalance({
    address: address as `0x${string}`,
    token: GOHM_ADDRESSES[networks.MAINNET] as `0x${string}`,
  });

  return {
    gOHMDelegationAddress,
    coolerV1ClearingHouseDelegationAddress,
    coolerV2ClearingHouseDelegationAddress,
    coolerV3ClearingHouseDelegationAddress,
    gohmBalance,
    gohmCoolerV1ClearingHouseBalance,
    gohmCoolerV2ClearingHouseBalance,
    gohmCoolerV3ClearingHouseBalance,
    gohmCoolerV2Balance: position?.collateral,
    coolerAddressV1,
    coolerAddressV2,
    coolerAddressV3,
    hasCoolerV2Delegations,
  };
};
