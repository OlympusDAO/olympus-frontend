import {
  BALANCER_VAULT_ADDRESSSES,
  BOND_AGGREGATOR_ADDRESSES,
  BOND_DEPOSITORY_ADDRESSES,
  BOND_FIXED_EXPIRY_TELLER_ADDRESSES,
  BOND_FIXED_TERM_TELLER_ADDRESSES,
  DEV_FAUCET,
  DISTRIBUTOR_ADDRESSES,
  GOV_INSTRUCTIONS_ADDRESSES,
  GOVERNANCE_ADDRESSES,
  MIGRATOR_ADDRESSES,
  OP_BOND_DEPOSITORY_ADDRESSES,
  RANGE_ADDRESSES,
  RANGE_OPERATOR_ADDRESSES,
  RANGE_PRICE_ADDRESSES,
  STAKING_ADDRESSES,
  VOTE_ISSUER_ADDRESSES,
  VOTE_TOKEN_ADDRESSES,
  ZAP_ADDRESSES,
} from "src/constants/addresses";
import { Contract } from "src/helpers/contracts/Contract";
import {
  BalancerVault__factory,
  BondDepository__factory,
  BondFixedExpiryTeller__factory,
  BondFixedTermTeller__factory,
  CrossChainMigrator__factory,
  IERC20__factory,
  OlympusGovernance__factory,
  OlympusGovInstructions__factory,
  OlympusProV2__factory,
  OlympusStakingv2__factory,
  OlympusVoteIssuer__factory,
  Range__factory,
  RangeOperator__factory,
  RangePrice__factory,
  Zap__factory,
} from "src/typechain";
import { BondAggregator__factory } from "src/typechain/factories/BondAggregator__factory";
import { DevFaucet__factory } from "src/typechain/factories/DevFaucet__factory";
import { OlympusDistributor__factory } from "src/typechain/factories/OlympusDistributor__factory";

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

export const RANGE_OPERATOR_CONTRACT = new Contract({
  factory: RangeOperator__factory,
  name: "Range Operator Contract",
  addresses: RANGE_OPERATOR_ADDRESSES,
});

export const RANGE_PRICE_CONTRACT = new Contract({
  factory: RangePrice__factory,
  name: "Range Price Contract",
  addresses: RANGE_PRICE_ADDRESSES,
});

export const RANGE_CONTRACT = new Contract({
  factory: Range__factory,
  name: "Range Contract",
  addresses: RANGE_ADDRESSES,
});

export const FAUCET = new Contract({
  factory: DevFaucet__factory,
  name: "Goerli Faucet Contract",
  addresses: DEV_FAUCET,
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

/** NOT USED */
export const VOTE_ISSUER_CONTRACT = new Contract({
  factory: OlympusVoteIssuer__factory,
  name: "Olympus Vote Issuer",
  addresses: VOTE_ISSUER_ADDRESSES,
});

export const VOTE_TOKEN_CONTRACT = new Contract({
  factory: IERC20__factory,
  name: "Olympus Vote Token",
  addresses: VOTE_TOKEN_ADDRESSES,
});

export const BOND_AGGREGATOR_CONTRACT = new Contract({
  factory: BondAggregator__factory,
  name: "Bond Aggregator Contract",
  addresses: BOND_AGGREGATOR_ADDRESSES,
});

export const BOND_FIXED_EXPIRY_TELLER = new Contract({
  factory: BondFixedExpiryTeller__factory,
  name: "Bond Teller Contract",
  addresses: BOND_FIXED_EXPIRY_TELLER_ADDRESSES,
});

export const BOND_FIXED_TERM_TELLER = new Contract({
  factory: BondFixedTermTeller__factory,
  name: "Bond Fixed Term Teller Contract",
  addresses: BOND_FIXED_TERM_TELLER_ADDRESSES,
});

export const DISTRIBUTOR_CONTRACT = new Contract({
  factory: OlympusDistributor__factory,
  name: "Distributor Contract",
  addresses: DISTRIBUTOR_ADDRESSES,
});
