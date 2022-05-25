/**
 * @deprecated
 * author: Sam Potter
 *
 * These contract hooks are no longer necessary. Rather than creating a new hook
 * below, please instead add that contract to the `src/constants/contracts` file
 * instead (or `src/contracts/tokens` if the contract is an ERC20 or LP token).
 *
 * You will be then be able to call `getEthersContract` wherever you need
 * throughout our entire app (including inside our components).
 */

import { Contract, ContractInterface } from "@ethersproject/contracts";
import { useMemo } from "react";
import BALANCERV2_POOL_ABI from "src/abi/BalancerV2Pool.json";
import BALANCER_VAULT_ABI from "src/abi/BalancerVault.json";
import BEETHOVEN_CHEF_ABI from "src/abi/BeethovenChef.json";
import BOBA_CHEF_ABI from "src/abi/BobaChef.json";
import BOBA_REWARDER_ABI from "src/abi/BobaRewarder.json";
import BOND_ABI from "src/abi/BondDepository.json";
import CROSS_CHAIN_MIGRATOR_ABI from "src/abi/CrossChainMigrator.json";
import CURVE_GAUGE_CONTROLLER_ABI from "src/abi/CurveGaugeController.json";
import CURVE_GAUGE_DEPOSIT_ABI from "src/abi/CurveGaugeDeposit.json";
import CURVE_POOL_ABI from "src/abi/CurvePool.json";
import FUSE_PROXY_ABI from "src/abi/FuseProxy.json";
import GAUGE_ABI from "src/abi/Gauge.json";
import IERC20_ABI from "src/abi/IERC20.json";
import JOECHEF_ABI from "src/abi/JoeChef.json";
import JOE_REWARDER_ABI from "src/abi/JoeRewarder.json";
import JONES_ABI from "src/abi/Jones.json";
import GIVE_ABI from "src/abi/OlympusGiving.json";
import GIVE_OLD_ABI from "src/abi/OlympusGivingOld.json";
import MOCK_GIVE_ABI from "src/abi/OlympusMockGiving.json";
import STAKING_ABI from "src/abi/OlympusStakingv2.json";
import PAIR_CONTRACT_ABI from "src/abi/PairContract.json";
import SOHM_ABI from "src/abi/sOhmv2.json";
import SUSHI_CHEF_ABI from "src/abi/SushiChef.json";
import SUSHI_REWARDER_ABI from "src/abi/SushiRewarder.json";
import ZIP_REWARDER_ABI from "src/abi/ZipRewarder.json";
import ZIP_SECONDARY_REWARDER_ABI from "src/abi/ZipSecondaryRewarder.json";
import { AddressMap } from "src/constants/addresses";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";
import {
  BobaChef,
  BobaRewarder,
  BondDepository,
  CrossChainMigrator,
  CurvePool,
  FuseProxy,
  IERC20,
  Jones,
  OlympusGiving,
  OlympusGivingOld,
  OlympusMockGiving,
  OlympusStakingv2,
  PairContract,
  SOhmv2,
} from "src/typechain";
import { BalancerV2Pool } from "src/typechain/BalancerV2Pool";
import { BalancerVault } from "src/typechain/BalancerVault";
import { BeethovenChef } from "src/typechain/BeethovenChef";
import { CurveGaugeController } from "src/typechain/CurveGaugeController";
import { CurveGaugeDeposit } from "src/typechain/CurveGaugeDeposit";
import { Gauge } from "src/typechain/Gauge";
import { JoeChef } from "src/typechain/JoeChef";
import { JoeRewarder } from "src/typechain/JoeRewarder";
import { SushiChef } from "src/typechain/SushiChef";
import { SushiRewarder } from "src/typechain/SushiRewarder";
import { ZipRewarder } from "src/typechain/ZipRewarder";
import { ZipSecondaryRewarder } from "src/typechain/ZipSecondaryRewarder";

import { useWeb3Context } from ".";

/**
 * @deprecated Please see note at the top of this file
 *
 * Helper function to create a static contract hook.
 * Static contracts require an explicit network id to be given as an argument.
 */
export const createStaticContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (address: string, networkId: NetworkId) => {
    const provider = Providers.getStaticProvider(networkId);

    return useMemo(() => new Contract(address, ABI, provider) as TContract, [address, provider]);
  };
};

/**
 * @deprecated Please see note at the top of this file
 *
 * Helper function to create a dynamic contract hook.
 * Dynamic contracts use the provider/signer injected by the users wallet.
 * Since a wallet can be connected to any network, a dynamic contract hook
 * can possibly return null if there is no contract address specified for
 * the currently active network.
 */
const createDynamicContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (addressMap: AddressMap, asSigner = false) => {
    const { provider, connected, networkId } = useWeb3Context();

    return useMemo(() => {
      const address = addressMap[networkId as keyof typeof addressMap];

      if (!address) return null;

      const providerOrSigner = asSigner && connected ? provider.getSigner() : provider;

      return new Contract(address, ABI, providerOrSigner) as TContract;
    }, [addressMap, asSigner, connected, networkId, provider]);
  };
};

/**
 * @deprecated Please see note at the top of this file
 *
 * Hook that returns a contract for every network in an address map
 */
export const createMultipleStaticContracts = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return <TAddressMap extends AddressMap = AddressMap>(addressMap: TAddressMap) => {
    return useMemo(() => {
      return Object.entries(addressMap).reduce((res, [networkId, address]) => {
        const _networkId = Number(networkId) as NetworkId;
        const provider = Providers.getStaticProvider(_networkId);
        const contract = new Contract(address, ABI, provider) as TContract;

        return Object.assign(res, { [networkId]: contract });
      }, {} as Record<keyof typeof addressMap, TContract>);
    }, [addressMap]);
  };
};

// Static contracts
export const useStaticSohmContract = createStaticContract<SOhmv2>(SOHM_ABI.abi);
export const useStaticTokenContract = createStaticContract<IERC20>(IERC20_ABI.abi);
export const useStaticFuseContract = createStaticContract<FuseProxy>(FUSE_PROXY_ABI.abi);
export const useStaticPairContract = createStaticContract<PairContract>(PAIR_CONTRACT_ABI.abi);
export const useStaticStakingContract = createStaticContract<OlympusStakingv2>(STAKING_ABI);
export const useStaticBondContract = createStaticContract<BondDepository>(BOND_ABI.abi);

export const useStaticMockGiveContract = createStaticContract<OlympusMockGiving>(MOCK_GIVE_ABI.abi);
export const useStaticChefContract = createStaticContract<SushiChef>(SUSHI_CHEF_ABI.abi);
export const useStaticChefRewarderContract = createStaticContract<SushiRewarder>(SUSHI_REWARDER_ABI.abi);
export const useStaticJoeChefContract = createStaticContract<JoeChef>(JOECHEF_ABI.abi);
export const useStaticJoeRewarderContract = createStaticContract<JoeRewarder>(JOE_REWARDER_ABI.abi);
export const useStaticGaugeContract = createStaticContract<Gauge>(GAUGE_ABI.abi);
export const useStaticBeethovenChefContract = createStaticContract<BeethovenChef>(BEETHOVEN_CHEF_ABI.abi);
export const useStaticBalancerV2PoolContract = createStaticContract<BalancerV2Pool>(BALANCERV2_POOL_ABI.abi);
export const useStaticBalancerVaultContract = createStaticContract<BalancerVault>(BALANCER_VAULT_ABI.abi);
export const useStaticZipRewarderContract = createStaticContract<ZipRewarder>(ZIP_REWARDER_ABI.abi);
export const useStaticZipSecondaryRewardercontract = createStaticContract<ZipSecondaryRewarder>(
  ZIP_SECONDARY_REWARDER_ABI.abi,
);
export const useStaticJonesContract = createStaticContract<Jones>(JONES_ABI.abi);
export const useStaticBobaChefContract = createStaticContract<BobaChef>(BOBA_CHEF_ABI.abi);
export const useStaticBobaRewarderContract = createStaticContract<BobaRewarder>(BOBA_REWARDER_ABI.abi);
export const useStaticCurvePoolContract = createStaticContract<CurvePool>(CURVE_POOL_ABI.abi);
export const useStaticCurveGaugeControllerContract = createStaticContract<CurveGaugeController>(
  CURVE_GAUGE_CONTROLLER_ABI.abi,
);
export const useStaticCurveGaugeDepositContract = createStaticContract<CurveGaugeDeposit>(CURVE_GAUGE_DEPOSIT_ABI.abi);

// Dynamic contracts
export const useDynamicTokenContract = createDynamicContract<IERC20>(IERC20_ABI.abi);
export const useDynamicStakingContract = createDynamicContract<OlympusStakingv2>(STAKING_ABI);
export const useDynamicGiveContract = createDynamicContract<OlympusGiving>(GIVE_ABI.abi);
export const useDynamicV1GiveContract = createDynamicContract<OlympusGivingOld>(GIVE_OLD_ABI.abi);
export const useDynamicMigratorContract = createDynamicContract<CrossChainMigrator>(CROSS_CHAIN_MIGRATOR_ABI.abi);

// Multiple static contracts
export const useMultipleTokenContracts = createMultipleStaticContracts<IERC20>(IERC20_ABI.abi);
