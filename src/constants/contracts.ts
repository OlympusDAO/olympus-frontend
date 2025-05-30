import {
  BALANCER_VAULT_ADDRESSSES,
  BOND_AGGREGATOR_ADDRESSES,
  BOND_DEPOSITORY_ADDRESSES,
  BOND_FIXED_EXPIRY_TELLER_ADDRESSES,
  BOND_FIXED_TERM_TELLER_ADDRESSES,
  COOLER_CLEARING_HOUSE_V1_ADDRESSES,
  COOLER_CLEARING_HOUSE_V2_ADDRESSES,
  COOLER_CLEARING_HOUSE_V3_ADDRESSES,
  COOLER_V2_COMPOSITES_ADDRESSES,
  COOLER_V2_MIGRATOR_ADDRESSES,
  COOLER_V2_MONOCOOLER_ADDRESSES,
  CROSS_CHAIN_BRIDGE_ADDRESSES,
  CROSS_CHAIN_BRIDGE_ADDRESSES_TESTNET,
  DEV_FAUCET,
  DISTRIBUTOR_ADDRESSES,
  EMISSION_MANAGER_ADDRESSES,
  LIQUIDITY_REGISTRY_ADDRESSES,
  MIGRATOR_ADDRESSES,
  OLYMPUS_GOVERNANCE_ADDRESSES,
  OP_BOND_DEPOSITORY_ADDRESSES,
  RANGE_ADDRESSES,
  RANGE_OPERATOR_ADDRESSES,
  RANGE_PRICE_ADDRESSES,
  SOHM_ADDRESSES,
  STAKING_ADDRESSES,
  ZAP_ADDRESSES,
} from "src/constants/addresses";
import { Contract } from "src/helpers/contracts/Contract";
import {
  BalancerVault__factory,
  BondDepository__factory,
  BondFixedExpiryTeller__factory,
  BondFixedTermTeller__factory,
  CoolerClearingHouse__factory,
  CoolerClearingHouseV3__factory,
  CoolerV2Composites__factory,
  CoolerV2MonoCooler__factory,
  CrossChainBridge__factory,
  CrossChainBridgeTestnet__factory,
  CrossChainMigrator__factory,
  EmissionManager__factory,
  OlympusGovernorBravo__factory,
  OlympusLiquidityRegistry__factory,
  OlympusProV2__factory,
  OlympusStakingv2__factory,
  Range__factory,
  RangeOperator__factory,
  RangePrice__factory,
  SOhmv2__factory,
  Zap__factory,
} from "src/typechain";
import { BondAggregator__factory } from "src/typechain/factories/BondAggregator__factory";
import { CoolerV2Migrator__factory } from "src/typechain/factories/CoolerV2Migrator__factory";
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

export const SOHM_CONTRACT = new Contract({
  factory: SOhmv2__factory,
  name: "sOHM Contract",
  addresses: SOHM_ADDRESSES,
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

export const LIQUDITY_REGISTRY_CONTRACT = new Contract({
  factory: OlympusLiquidityRegistry__factory,
  name: "Liquidity Registry Contract",
  addresses: LIQUIDITY_REGISTRY_ADDRESSES,
});

export const CROSS_CHAIN_BRIDGE_CONTRACT = new Contract({
  factory: CrossChainBridge__factory,
  name: "Cross Chain Bridge Contract",
  addresses: CROSS_CHAIN_BRIDGE_ADDRESSES,
});

export const CROSS_CHAIN_BRIDGE_CONTRACT_TESTNET = new Contract({
  factory: CrossChainBridgeTestnet__factory,
  name: "Cross Chain Bridge Contract",
  addresses: CROSS_CHAIN_BRIDGE_ADDRESSES_TESTNET,
});

export const COOLER_CLEARING_HOUSE_CONTRACT_V1 = new Contract({
  factory: CoolerClearingHouse__factory,
  name: "Cooler Clearing House Contract V1",
  addresses: COOLER_CLEARING_HOUSE_V1_ADDRESSES,
});

export const COOLER_CLEARING_HOUSE_CONTRACT_V2 = new Contract({
  factory: CoolerClearingHouse__factory,
  name: "Cooler Clearing House Contract V2",
  addresses: COOLER_CLEARING_HOUSE_V2_ADDRESSES,
});

export const COOLER_CLEARING_HOUSE_CONTRACT_V3 = new Contract({
  factory: CoolerClearingHouseV3__factory,
  name: "Cooler Clearing House Contract V3",
  addresses: COOLER_CLEARING_HOUSE_V3_ADDRESSES,
});

export const GOVERNANCE_CONTRACT = new Contract({
  factory: OlympusGovernorBravo__factory,
  name: "Governance Contract",
  addresses: OLYMPUS_GOVERNANCE_ADDRESSES,
});

export const EMISSION_MANAGER_CONTRACT = new Contract({
  factory: EmissionManager__factory,
  name: "Emissions Manager",
  addresses: EMISSION_MANAGER_ADDRESSES,
});

export const COOLER_V2_MONOCOOLER_CONTRACT = new Contract({
  factory: CoolerV2MonoCooler__factory,
  name: "Cooler V2 MonoCooler",
  addresses: COOLER_V2_MONOCOOLER_ADDRESSES,
});

export const COOLER_V2_COMPOSITES_CONTRACT = new Contract({
  factory: CoolerV2Composites__factory,
  name: "Cooler V2 Composites",
  addresses: COOLER_V2_COMPOSITES_ADDRESSES,
});

export const COOLER_V2_MIGRATOR_CONTRACT = new Contract({
  factory: CoolerV2Migrator__factory,
  name: "Cooler V2 Migrator",
  addresses: COOLER_V2_MIGRATOR_ADDRESSES,
});
