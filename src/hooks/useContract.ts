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
import BOND_ABI from "src/abi/BondDepository.json";
import CROSS_CHAIN_MIGRATOR_ABI from "src/abi/CrossChainMigrator.json";
import CURVE_GAUGE_CONTROLLER_ABI from "src/abi/CurveGaugeController.json";
import CURVE_GAUGE_DEPOSIT_ABI from "src/abi/CurveGaugeDeposit.json";
import CURVE_POOL_ABI from "src/abi/CurvePool.json";
import DEV_FAUCET from "src/abi/DevFaucet.json";
import FUSE_PROXY_ABI from "src/abi/FuseProxy.json";
import IERC20_ABI from "src/abi/IERC20.json";
import STAKING_ABI from "src/abi/OlympusStakingv2.json";
import PAIR_CONTRACT_ABI from "src/abi/PairContract.json";
import SOHM_ABI from "src/abi/sOhmv2.json";
import { AddressMap } from "src/constants/addresses";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";
import {
  BondDepository,
  CrossChainMigrator,
  CurvePool,
  DevFaucet,
  FuseProxy,
  IERC20,
  OlympusStakingv2,
  PairContract,
  SOhmv2,
} from "src/typechain";
import { BalancerV2Pool } from "src/typechain/BalancerV2Pool";
import { BalancerVault } from "src/typechain/BalancerVault";
import { CurveGaugeController } from "src/typechain/CurveGaugeController";
import { CurveGaugeDeposit } from "src/typechain/CurveGaugeDeposit";
import { useNetwork, useProvider, useSigner } from "wagmi";

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
    const provider = useProvider();
    const { data: signer } = useSigner();
    const { chain = { id: 1 } } = useNetwork();

    return useMemo(() => {
      const address = addressMap[chain.id as keyof typeof addressMap];

      if (!address) return null;

      const providerOrSigner = asSigner && signer ? signer : provider;

      return new Contract(address, ABI, providerOrSigner) as TContract;
    }, [addressMap, chain.id, asSigner, signer, provider]);
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

export const useStaticBalancerV2PoolContract = createStaticContract<BalancerV2Pool>(BALANCERV2_POOL_ABI.abi);
export const useStaticBalancerVaultContract = createStaticContract<BalancerVault>(BALANCER_VAULT_ABI.abi);
export const useStaticCurvePoolContract = createStaticContract<CurvePool>(CURVE_POOL_ABI.abi);
export const useStaticCurveGaugeControllerContract = createStaticContract<CurveGaugeController>(
  CURVE_GAUGE_CONTROLLER_ABI.abi,
);
export const useStaticCurveGaugeDepositContract = createStaticContract<CurveGaugeDeposit>(CURVE_GAUGE_DEPOSIT_ABI.abi);

// Dynamic contracts
export const useDynamicTokenContract = createDynamicContract<IERC20>(IERC20_ABI.abi);
export const useDynamicStakingContract = createDynamicContract<OlympusStakingv2>(STAKING_ABI);
export const useDynamicMigratorContract = createDynamicContract<CrossChainMigrator>(CROSS_CHAIN_MIGRATOR_ABI.abi);
export const useDynamicFaucetContract = createDynamicContract<DevFaucet>(DEV_FAUCET.abi);

// Multiple static contracts
export const useMultipleTokenContracts = createMultipleStaticContracts<IERC20>(IERC20_ABI.abi);
