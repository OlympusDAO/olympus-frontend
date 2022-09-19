import {
  BALANCER_VAULT_ADDRESSSES,
  BOND_DEPOSITORY_ADDRESSES,
  DEV_FAUCET,
  MIGRATOR_ADDRESSES,
  OP_BOND_DEPOSITORY_ADDRESSES,
  STAKING_ADDRESSES,
  ZAP_ADDRESSES,
} from "src/constants/addresses";
import { Contract } from "src/helpers/contracts/Contract";
import {
  BalancerVault__factory,
  BondDepository__factory,
  CrossChainMigrator__factory,
  OlympusProV2__factory,
  OlympusStakingv2__factory,
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
