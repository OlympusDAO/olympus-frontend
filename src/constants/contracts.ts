import {
  BALANCER_VAULT_ADDRESSSES,
  BOND_DEPOSITORY_ADDRESSES,
  DEV_FAUCET,
  FIATDAO_WSOHM_ADDRESSES,
  FUSE_POOL_6_ADDRESSES,
  FUSE_POOL_18_ADDRESSES,
  FUSE_POOL_36_ADDRESSES,
  GIVE_ADDRESSES,
  GOV_INSTRUCTIONS_ADDRESSES,
  GOVERNANCE_ADDRESSES,
  MIGRATOR_ADDRESSES,
  OLD_GIVE_ADDRESSES,
  OP_BOND_DEPOSITORY_ADDRESSES,
  PT_PRIZE_POOL_ADDRESSES,
  STAKING_ADDRESSES,
  VOTE_ISSUER_ADDRESSES,
  ZAP_ADDRESSES,
} from "src/constants/addresses";
import { Contract } from "src/helpers/contracts/Contract";
import {
  BalancerVault__factory,
  BondDepository__factory,
  CrossChainMigrator__factory,
  FiatDAOContract__factory,
  FuseProxy__factory,
  OlympusGiving__factory,
  OlympusGivingOld__factory,
  OlympusGovernance__factory,
  OlympusGovInstructions__factory,
  OlympusProV2__factory,
  OlympusStakingv2__factory,
  OlympusVoteIssuer__factory,
  PrizePool__factory,
  Zap__factory,
} from "src/typechain";
import { DevFaucet__factory } from "src/typechain/factories/DevFaucet__factory";

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

export const FAUCET = new Contract({
  factory: DevFaucet__factory,
  name: "Goerli Faucet Contract",
  addresses: DEV_FAUCET,
});

export const GIVE_CONTRACT = new Contract({
  factory: OlympusGiving__factory,
  name: "Olympus Give Contract",
  addresses: GIVE_ADDRESSES,
});

export const OLD_GIVE_CONTRACT = new Contract({
  factory: OlympusGivingOld__factory,
  name: "Olympus Give Contract V1",
  addresses: OLD_GIVE_ADDRESSES,
});

export const GOVERNANCE_CONTRACT = new Contract({
  factory: OlympusGovernance__factory,
  name: "Olympus Governance",
  addresses: GOVERNANCE_ADDRESSES,
});

export const GOV_INSTRUCTIONS_CONTRACT = new Contract({
  factory: OlympusGovInstructions__factory,
  name: "Olympus Governance Instructions",
  addresses: GOV_INSTRUCTIONS_ADDRESSES,
});

export const VOTE_ISSUER_CONTRACT = new Contract({
  factory: OlympusVoteIssuer__factory,
  name: "Olympus Vote Issuer",
  addresses: VOTE_ISSUER_ADDRESSES,
});
