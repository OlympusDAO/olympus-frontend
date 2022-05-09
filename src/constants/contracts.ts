import { Contract } from "src/helpers/contracts/Contract";
import {
  BalancerVault__factory,
  BondDepository__factory,
  CrossChainMigrator__factory,
  FiatDAOContract__factory,
  FuseProxy__factory,
  OlympusProV2__factory,
  OlympusStakingv2__factory,
  PrizePool__factory,
  Zap__factory,
} from "src/typechain";

import {
  BALANCER_VAULT_ADDRESSSES,
  BOND_DEPOSITORY_ADDRESSES,
  FIATDAO_WSOHM_ADDRESSES,
  FUSE_POOL_6_ADDRESSES,
  FUSE_POOL_18_ADDRESSES,
  FUSE_POOL_36_ADDRESSES,
  MIGRATOR_ADDRESSES,
  OP_BOND_DEPOSITORY_ADDRESSES,
  PT_PRIZE_POOL_ADDRESSES,
  STAKING_ADDRESSES,
  ZAP_ADDRESSES,
} from "./addresses";

export const BOND_DEPOSITORY_CONTRACT = new Contract({
  factory: BondDepository__factory,
  name: "Bond Depository Contract",
  addresses: BOND_DEPOSITORY_ADDRESSES,
});

export const OP_BOND_DEPOSITORY_CONTRACT = new Contract({
  factory: OlympusProV2__factory,
  name: "Olympus Pro Bond Depository Contract",
  addresses: OP_BOND_DEPOSITORY_ADDRESSES,
});

export const STAKING_CONTRACT = new Contract({
  factory: OlympusStakingv2__factory,
  name: "Staking Contract",
  addresses: STAKING_ADDRESSES,
});

export const ZAP_CONTRACT = new Contract({
  factory: Zap__factory,
  name: "Zap Contract",
  addresses: ZAP_ADDRESSES,
});

export const MIGRATOR_CONTRACT = new Contract({
  factory: CrossChainMigrator__factory,
  name: "Cross-chain Migrator Contract",
  addresses: MIGRATOR_ADDRESSES,
});

export const PT_PRIZE_POOL_CONTRACT = new Contract({
  factory: PrizePool__factory,
  name: "PoolTogether Prize Pool Contract",
  addresses: PT_PRIZE_POOL_ADDRESSES,
});

export const FUSE_POOL_36_CONTRACT = new Contract({
  factory: FuseProxy__factory,
  name: "Fuse Pool 36 Contract",
  addresses: FUSE_POOL_36_ADDRESSES,
});

export const FUSE_POOL_18_CONTRACT = new Contract({
  factory: FuseProxy__factory,
  name: "Fuse Pool 18 Contract",
  addresses: FUSE_POOL_18_ADDRESSES,
});

export const FUSE_POOL_6_CONTRACT = new Contract({
  factory: FuseProxy__factory,
  name: "Fuse Pool 6 Contract",
  addresses: FUSE_POOL_6_ADDRESSES,
});

export const FIATDAO_WSOHM_CONTRACT = new Contract({
  factory: FiatDAOContract__factory,
  name: "FiatDAO Contract",
  addresses: FIATDAO_WSOHM_ADDRESSES,
});

export const BALANCER_VAULT = new Contract({
  factory: BalancerVault__factory,
  name: "Balancer Vault Contract",
  addresses: BALANCER_VAULT_ADDRESSSES,
});
