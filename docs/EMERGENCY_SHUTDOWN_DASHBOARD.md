# Emergency Shutdown Dashboard

Technical documentation for the Emergency Shutdown Dashboard feature.

## Overview

The Emergency Shutdown Dashboard provides a UI for Olympus protocol signers to quickly disable protocol components during emergencies. Instead of manually constructing transactions, signers can initiate shutdowns with a single click.

### Goals

- **Speed**: Reduce emergency response time from ~30 minutes to ~30 seconds
- **Simplicity**: One-click shutdown for each component
- **Accuracy**: Pre-configured transactions eliminate human error
- **Maintainability**: Auto-generated from source documentation

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   olympus-v3 repo (emergency branch)                                        │
│   ┌──────────────────────────────────────────────────────────────────┐      │
│   │  documentation/emergency/EMERGENCY_SHUTDOWN.md                    │      │
│   │  documentation/emergency/abis/*.json                              │      │
│   │  src/scripts/env.json                                             │      │
│   └──────────────────────────────────────────────────────────────────┘      │
│                              │                                               │
│                              │ yarn codegen:emergency                        │
│                              ▼                                               │
│   olympus-frontend                                                           │
│   ┌──────────────────────────────────────────────────────────────────┐      │
│   │  scripts/emergency-codegen.ts        (fetches & parses)          │      │
│   └──────────────────────────────────────────────────────────────────┘      │
│                              │                                               │
│                              ▼                                               │
│   ┌──────────────────────────────────────────────────────────────────┐      │
│   │  src/generated/emergency/                                         │      │
│   │    ├── components.ts      (component definitions)                 │      │
│   │    ├── addresses.ts       (contract addresses by chain)           │      │
│   │    ├── abis/              (contract ABIs)                         │      │
│   │    └── index.ts           (barrel export)                         │      │
│   └──────────────────────────────────────────────────────────────────┘      │
│                              │                                               │
│                              ▼                                               │
│   ┌──────────────────────────────────────────────────────────────────┐      │
│   │  src/views/EmergencyShutdown/                                     │      │
│   │    └── UI Components (read generated data)                        │      │
│   └──────────────────────────────────────────────────────────────────┘      │
│                              │                                               │
│                              ▼                                               │
│   ┌──────────────────────────────────────────────────────────────────┐      │
│   │  Safe Transaction Service API                                     │      │
│   │    └── Propose batch transaction to multisig                      │      │
│   └──────────────────────────────────────────────────────────────────┘      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Code Generation

### Source Files

The codegen script fetches from the `olympus-v3` repository (`emergency` branch):

| Source | URL | Purpose |
|--------|-----|---------|
| Solidity Scripts | `src/scripts/emergency/*.sol` | **Source of truth** for which functions to call and with what arguments |
| Documentation | `documentation/emergency/EMERGENCY_SHUTDOWN.md` | Component descriptions, shutdown criteria, which multisig owns each |
| Addresses | `src/scripts/env.json` | Contract addresses for all chains |
| ABIs | `documentation/emergency/abis/*.json` | Contract interfaces for encoding calls |

### How Transaction Data is Sourced

The transaction data (what function to call, with what arguments) comes from the **Solidity scripts** in olympus-v3, NOT from user input or hardcoded values.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TRANSACTION DATA FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   BUILD TIME (codegen)                        RUNTIME (UI)                   │
│   ════════════════════                        ════════════                   │
│                                                                              │
│   Solidity Scripts (olympus-v3)               User clicks "SHUTDOWN"         │
│   ┌────────────────────────────┐              ┌─────────────────────────┐   │
│   │ // Treasury.sol            │              │                         │   │
│   │ addToBatch(                │              │  1. Lookup component    │   │
│   │   emergencyAddress,        │─── codegen ──→│     config from         │   │
│   │   abi.encodeWithSelector(  │   generates  │     EMERGENCY_COMPONENTS│   │
│   │     IEmergency             │              │                         │   │
│   │     .shutdownWithdrawals   │              │  2. Get addresses for   │   │
│   │     .selector              │              │     current chain from  │   │
│   │   )                        │              │     EMERGENCY_ADDRESSES │   │
│   │ );                         │              │                         │   │
│   └────────────────────────────┘              │  3. Encode calls with   │   │
│                                               │     viem/ethers         │   │
│   env.json                                    │                         │   │
│   ┌────────────────────────────┐              │  4. Create Safe tx      │   │
│   │ {                          │              │                         │   │
│   │   "mainnet": {             │─── codegen ──→│  5. Propose to Safe    │   │
│   │     "emergency": "0x..."   │   extracts   │     Transaction Service │   │
│   │   }                        │   addresses  │                         │   │
│   │ }                          │              └─────────────────────────┘   │
│   └────────────────────────────┘                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Example: Treasury Shutdown

**Step 1: Solidity Script (source of truth)**

```solidity
// olympus-v3/src/scripts/emergency/Treasury.sol
function run(...) external {
    address emergencyAddress = envAddress("olympus.policies.Emergency");

    addToBatch(
        emergencyAddress,
        abi.encodeWithSelector(IEmergency.shutdownWithdrawals.selector)
    );

    proposeBatch();
}
```

**Step 2: Codegen extracts this → `components.ts`**

```typescript
// src/generated/emergency/components.ts (GENERATED)
{
  id: "treasury",
  name: "Treasury (TRSRY)",
  calls: [
    {
      contractKey: "emergency",           // from envAddress("olympus.policies.Emergency")
      functionName: "shutdownWithdrawals", // from selector
      args: [],                            // no arguments
    },
  ],
}
```

**Step 3: Runtime - User clicks button**

```typescript
// What happens when user clicks "INITIATE SHUTDOWN"
const createShutdownTransaction = async (component: EmergencyComponent) => {
  // 1. Get addresses for current chain
  const addresses = EMERGENCY_ADDRESSES["mainnet"];
  // addresses.emergency = "0x1234..."

  // 2. Get ABI
  const abi = emergencyAbi;

  // 3. Encode each call from component.calls
  const transactions = component.calls.map((call) => ({
    to: addresses[call.contractKey],      // "0x1234..."
    value: "0",
    data: encodeFunctionData({
      abi: abi,
      functionName: call.functionName,    // "shutdownWithdrawals"
      args: call.args,                    // []
    }),
    // data = "0x8456cb59" (function selector)
  }));

  // 4. Create and propose Safe transaction
  const safeTx = await safe.createTransaction({ transactions });
  await safeService.proposeTransaction(...);
};
```

#### Example: Cooler V2 (Batch with 2 calls)

**Solidity Script:**

```solidity
// CoolerV2.sol
addToBatch(coolerV2Address, abi.encodeWithSelector(IMonoCooler.setBorrowPaused.selector, true));
addToBatch(coolerV2Address, abi.encodeWithSelector(IMonoCooler.setLiquidationsPaused.selector, true));
```

**Generated Config:**

```typescript
{
  id: "cooler-v2",
  calls: [
    { contractKey: "monoCooler", functionName: "setBorrowPaused", args: [true] },
    { contractKey: "monoCooler", functionName: "setLiquidationsPaused", args: [true] },
  ],
}
```

**Runtime Result (batch transaction to Safe):**

```typescript
const transactions = [
  {
    to: "0xdb591Ea2e5Db886dA872654D58f6cc584b68e7cC",
    data: "0x1234...", // setBorrowPaused(true)
    value: "0",
  },
  {
    to: "0xdb591Ea2e5Db886dA872654D58f6cc584b68e7cC",
    data: "0x5678...", // setLiquidationsPaused(true)
    value: "0",
  },
];
// Safe executes both calls atomically
```

#### Key Points

| Question | Answer |
|----------|--------|
| Is it hardcoded? | Yes, but **generated** from Solidity scripts |
| Does user specify the transaction? | **No**, user only clicks a button |
| Where does data come from? | From `olympus-v3` repo via **codegen** |
| When is it updated? | When someone runs `yarn codegen:emergency` |

**User sees:**
```
[🔴 INITIATE SHUTDOWN]
```

**User does NOT need to know:**
- Which function to call
- What arguments to pass
- Which contract address to use

All of this is pre-configured in generated files based on the Solidity scripts from olympus-v3.

### Running Codegen

```bash
# Generate emergency shutdown config
yarn codegen:emergency

# Or run as part of full codegen
yarn codegen
```

### Generated Files

#### `src/generated/emergency/components.ts`

Contains the list of all emergency components with their metadata and shutdown calls:

```typescript
import { EmergencyComponent } from "./types";

export const EMERGENCY_COMPONENTS: EmergencyComponent[] = [
  {
    id: "treasury",
    name: "Treasury (TRSRY)",
    description: "Prevent unauthorized treasury withdrawals",
    shutdownCriteria: [
      "Active exploits or code vulnerabilities risking fund loss",
      "Unauthorized withdrawal attempts detected",
    ],
    owner: "emergency_ms",
    chains: ["mainnet", "base", "berachain", "sepolia"],
    calls: [
      {
        contractKey: "emergency",
        functionName: "shutdownWithdrawals",
        args: [],
      },
    ],
  },
  {
    id: "minter",
    name: "Minter (MINTR)",
    description: "Stop OHM minting operations",
    shutdownCriteria: [
      "Unauthorized minting capabilities discovered",
      "Minting logic compromised",
    ],
    owner: "emergency_ms",
    chains: ["mainnet", "base", "berachain", "sepolia"],
    calls: [
      {
        contractKey: "emergency",
        functionName: "shutdownMinting",
        args: [],
      },
    ],
  },
  {
    id: "cooler-v2",
    name: "Cooler V2",
    description: "Pause borrowing and liquidation mechanisms",
    shutdownCriteria: [
      "Oracle manipulation or failures",
      "Lending protocol vulnerabilities",
    ],
    owner: "emergency_ms",
    chains: ["mainnet", "sepolia"],
    calls: [
      {
        contractKey: "monoCooler",
        functionName: "setBorrowPaused",
        args: [true],
      },
      {
        contractKey: "monoCooler",
        functionName: "setLiquidationsPaused",
        args: [true],
      },
    ],
  },
  {
    id: "cooler-v2-periphery",
    name: "Cooler V2 Periphery",
    description: "Disable composites and migrator helpers",
    shutdownCriteria: ["Periphery contract vulnerabilities"],
    owner: "dao_ms",
    chains: ["mainnet", "sepolia"],
    calls: [
      {
        contractKey: "coolerComposites",
        functionName: "disable",
        args: ["0x"],
      },
      {
        contractKey: "coolerMigrator",
        functionName: "disable",
        args: ["0x"],
      },
    ],
  },
  {
    id: "emission-manager",
    name: "Emission Manager",
    description: "Stop emission management operations",
    shutdownCriteria: ["Emission logic compromised"],
    owner: "emergency_ms",
    chains: ["mainnet"],
    calls: [
      {
        contractKey: "emissionManager",
        functionName: "shutdown",
        args: [],
      },
    ],
  },
  {
    id: "ccip-bridge",
    name: "CCIP Bridge",
    description: "Disable CCIP cross-chain bridge",
    shutdownCriteria: [
      "Bridge vulnerabilities discovered",
      "Cross-chain message manipulation",
    ],
    owner: "dao_ms",
    chains: ["mainnet", "base", "berachain", "arbitrum"],
    calls: [
      {
        contractKey: "ccipBridge",
        functionName: "disable",
        args: ["0x"],
      },
    ],
  },
  {
    id: "layerzero-bridge",
    name: "LayerZero Bridge",
    description: "Disable LayerZero cross-chain bridging",
    shutdownCriteria: ["LayerZero bridge vulnerabilities"],
    owner: "dao_ms",
    chains: ["mainnet", "arbitrum", "base"],
    calls: [
      {
        contractKey: "layerZeroBridge",
        functionName: "setBridgeStatus",
        args: [false],
      },
    ],
  },
  {
    id: "heart",
    name: "Heart",
    description: "Disable heart beat operations",
    shutdownCriteria: ["Heart logic compromised", "Price manipulation detected"],
    owner: "emergency_ms",
    chains: ["mainnet"],
    calls: [
      {
        contractKey: "heart",
        functionName: "disable",
        args: ["0x"],
      },
    ],
  },
  {
    id: "yield-repurchase-facility",
    name: "Yield Repurchase Facility",
    description: "Shutdown yield repurchase operations",
    shutdownCriteria: ["YRF logic compromised"],
    owner: "dao_ms",
    chains: ["mainnet"],
    calls: [
      {
        contractKey: "yieldRepurchaseFacility",
        functionName: "shutdown",
        args: [], // Note: requires ERC20[] parameter - handled specially in UI
      },
    ],
  },
  {
    id: "reserve-migrator",
    name: "Reserve Migrator",
    description: "Deactivate reserve migration",
    shutdownCriteria: ["Migration logic compromised"],
    owner: "dao_ms",
    chains: ["mainnet"],
    calls: [
      {
        contractKey: "reserveMigrator",
        functionName: "deactivate",
        args: [],
      },
    ],
  },
  {
    id: "reserve-wrapper",
    name: "Reserve Wrapper",
    description: "Disable reserve wrapper",
    shutdownCriteria: ["Wrapper vulnerabilities"],
    owner: "dao_ms",
    chains: ["mainnet"],
    calls: [
      {
        contractKey: "reserveWrapper",
        functionName: "disable",
        args: ["0x"],
      },
    ],
  },
  {
    id: "convertible-deposits",
    name: "Convertible Deposits",
    description: "Disable convertible deposit facilities",
    shutdownCriteria: ["CD facility vulnerabilities"],
    owner: "emergency_ms",
    chains: ["mainnet"],
    calls: [
      {
        contractKey: "convertibleDepositFacility",
        functionName: "disable",
        args: ["0x"],
      },
      {
        contractKey: "depositRedemptionVault",
        functionName: "disable",
        args: ["0x"],
      },
      {
        contractKey: "depositManager",
        functionName: "disable",
        args: ["0x"],
      },
    ],
  },
];
```

#### `src/generated/emergency/addresses.ts`

Contains contract addresses organized by chain:

```typescript
import { ChainId } from "./types";

export const EMERGENCY_ADDRESSES: Record<ChainId, ChainAddresses> = {
  mainnet: {
    // Multisigs
    emergency_ms: "0xa8A6ff2606b24F61AFA986381D8991DFcCCd2D55",
    dao_ms: "0x245cc372C84B3645Bf0Ffe6538620B04a217988B",

    // Core contracts
    emergency: "0x...", // Emergency policy
    monoCooler: "0xdb591Ea2e5Db886dA872654D58f6cc584b68e7cC",
    coolerComposites: "0x6593768feBF9C95aC857Fb7Ef244D5738D1C57Fd",
    coolerMigrator: "0xE045BD0A0d85E980AA152064C06EAe6B6aE358D2",
    emissionManager: "0x50f441a3387625bDA8B8081cE3fd6C04CC48C0A2",
    ccipBridge: "0x...",
    layerZeroBridge: "0x...",
    heart: "0x...",
    yieldRepurchaseFacility: "0x...",
    reserveMigrator: "0x...",
    reserveWrapper: "0x...",
    convertibleDepositFacility: "0x...",
    depositRedemptionVault: "0x...",
    depositManager: "0x...",
  },

  base: {
    emergency_ms: "0x18a390bD45bCc92652b9A91AD51Aed7f1c1358f5",
    dao_ms: "0x...",
    // ... base addresses
  },

  berachain: {
    emergency_ms: "0xa5ea62894027D981D34BB99A04BD36B818b2Aaf0",
    dao_ms: "0x...",
    // ... berachain addresses
  },

  arbitrum: {
    emergency_ms: "", // Not configured yet!
    dao_ms: "0x...",
    // ... arbitrum addresses
  },

  sepolia: {
    emergency_ms: "0x81E6E5Ba12a11ceed3E8BfE825B56ae9b7260691",
    dao_ms: "0x...",
    // ... sepolia addresses
  },

  "base-sepolia": {
    emergency_ms: "0x1A5309F208f161a393E8b5A253de8Ab894A67188",
    dao_ms: "0x...",
    // ... base-sepolia addresses
  },

  "berachain-bartio": {
    emergency_ms: "0x1A5309F208f161a393E8b5A253de8Ab894A67188",
    dao_ms: "0x...",
    // ... berachain-bartio addresses
  },
};

// Chain ID mapping
export const CHAIN_ID_MAP: Record<number, ChainId> = {
  1: "mainnet",
  8453: "base",
  80084: "berachain",
  42161: "arbitrum",
  11155111: "sepolia",
  84532: "base-sepolia",
  80085: "berachain-bartio",
};
```

#### `src/generated/emergency/abis/`

Directory containing ABI JSON files:

```
src/generated/emergency/abis/
├── emergency.json
├── cooler_v2.json
├── heart.json
├── emission_manager.json
├── cross_chain_bridge.json
├── periphery_enabler.json
├── reserve_migrator.json
├── yield_repurchase_facility.json
└── bond_manager.json
```

#### `src/generated/emergency/types.ts`

TypeScript types for the generated data:

```typescript
export type ChainId =
  | "mainnet"
  | "base"
  | "berachain"
  | "arbitrum"
  | "sepolia"
  | "base-sepolia"
  | "berachain-bartio";

export type MultisigOwner = "emergency_ms" | "dao_ms";

export interface EmergencyCall {
  /** Key to look up contract address in EMERGENCY_ADDRESSES */
  contractKey: string;
  /** Function name to call */
  functionName: string;
  /** Arguments to pass to the function */
  args: unknown[];
}

export interface EmergencyComponent {
  /** Unique identifier (e.g., "treasury", "cooler-v2") */
  id: string;
  /** Display name */
  name: string;
  /** What this component does */
  description: string;
  /** When should this be shut down */
  shutdownCriteria: string[];
  /** Which multisig can execute the shutdown */
  owner: MultisigOwner;
  /** Which chains this component exists on */
  chains: ChainId[];
  /** Function calls to execute for shutdown */
  calls: EmergencyCall[];
}

export interface ChainAddresses {
  emergency_ms: string;
  dao_ms: string;
  [contractKey: string]: string;
}
```

#### `src/generated/emergency/index.ts`

Barrel export:

```typescript
export * from "./types";
export * from "./components";
export * from "./addresses";

// ABIs
export { default as emergencyAbi } from "./abis/emergency.json";
export { default as coolerV2Abi } from "./abis/cooler_v2.json";
export { default as heartAbi } from "./abis/heart.json";
export { default as emissionManagerAbi } from "./abis/emission_manager.json";
export { default as crossChainBridgeAbi } from "./abis/cross_chain_bridge.json";
export { default as peripheryEnablerAbi } from "./abis/periphery_enabler.json";
export { default as reserveMigratorAbi } from "./abis/reserve_migrator.json";
export { default as yieldRepurchaseFacilityAbi } from "./abis/yield_repurchase_facility.json";
export { default as bondManagerAbi } from "./abis/bond_manager.json";
```

## Codegen Script - Automatic Parsing

The codegen script **automatically parses** source files from olympus-v3 repository. No hardcoded components - everything is discovered dynamically.

### Why Automatic Parsing?

| Approach | Manual/Hardcoded | Automatic Parsing |
|----------|------------------|-------------------|
| New component added | Must update script manually | Detected automatically |
| Component removed | Must remove from script | Removed automatically |
| Function changed | Must update script | Updated automatically |
| New chain added | Must add to script | Detected automatically |

### Parsing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AUTOMATIC PARSING FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Step 1: Discover Solidity Files                                            │
│  ════════════════════════════════                                            │
│  Fetch directory listing: src/scripts/emergency/                            │
│  Filter: *.sol files (exclude IEmergencyBatch.sol interface)                │
│  Result: [Treasury.sol, CoolerV2.sol, Heart.sol, ...]                       │
│                                                                              │
│                              │                                               │
│                              ▼                                               │
│  Step 2: Parse Each Solidity File                                           │
│  ════════════════════════════════                                            │
│  For each .sol file, extract using regex:                                   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ // Treasury.sol                                                      │    │
│  │                                                                      │    │
│  │ address emergencyAddress = envAddress("olympus.policies.Emergency"); │    │
│  │                           ─────────────┬────────────────────────────│    │
│  │                                        │                             │    │
│  │                                        ▼                             │    │
│  │                              contractKey: "emergency"                │    │
│  │                              envPath: "olympus.policies.Emergency"   │    │
│  │                                                                      │    │
│  │ addToBatch(                                                          │    │
│  │     emergencyAddress,                                                │    │
│  │     abi.encodeWithSelector(IEmergency.shutdownWithdrawals.selector) │    │
│  │ );                         ──────────┬──────────────────────────────│    │
│  │                                      │                               │    │
│  │                                      ▼                               │    │
│  │                            functionName: "shutdownWithdrawals"       │    │
│  │                            interface: "IEmergency"                   │    │
│  │                            args: []                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│                              │                                               │
│                              ▼                                               │
│  Step 3: Parse Markdown for Metadata                                        │
│  ═══════════════════════════════════                                         │
│  From EMERGENCY_SHUTDOWN.md extract:                                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ### Treasury (TRSRY)           → name: "Treasury (TRSRY)"           │    │
│  │ - **Script:** `treasury`       → id: "treasury" (matches .sol file) │    │
│  │ - **Function:** `shutdown..`   → validation for parsed function     │    │
│  │ - **Multisig:** Emergency MS   → owner: "emergency_ms"              │    │
│  │ - **Purpose:** Prevent unauth  → description                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│                              │                                               │
│                              ▼                                               │
│  Step 4: Parse env.json for Addresses                                       │
│  ════════════════════════════════════                                        │
│  Map envPath → actual contract address per chain:                           │
│                                                                              │
│  "olympus.policies.Emergency" → {                                           │
│    mainnet: "0x1234...",                                                    │
│    base: "0x5678...",                                                       │
│    sepolia: "0x9abc..."                                                     │
│  }                                                                          │
│                                                                              │
│                              │                                               │
│                              ▼                                               │
│  Step 5: Discover ABIs                                                      │
│  ═════════════════════                                                       │
│  Fetch directory: documentation/emergency/abis/                             │
│  Download all *.json files found                                            │
│                                                                              │
│                              │                                               │
│                              ▼                                               │
│  Step 6: Generate TypeScript Files                                          │
│  ═════════════════════════════════                                           │
│  Combine all parsed data into:                                              │
│  - components.ts                                                            │
│  - addresses.ts                                                             │
│  - types.ts                                                                 │
│  - index.ts                                                                 │
│  - abis/*.json                                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Regex Patterns Used

#### 1. Parse `envAddress()` calls to get contract keys

```typescript
// Pattern: envAddress("olympus.policies.Emergency")
const envAddressPattern = /(\w+)\s*=\s*envAddress\s*\(\s*["']([^"']+)["']\s*\)/g;

// Input:  address emergencyAddress = envAddress("olympus.policies.Emergency");
// Output: { variable: "emergencyAddress", path: "olympus.policies.Emergency" }
```

#### 2. Parse `addToBatch()` calls to get function calls

```typescript
// Pattern: addToBatch(address, abi.encodeWithSelector(Interface.function.selector, args))
const addToBatchPattern = /addToBatch\s*\(\s*(\w+)\s*,\s*abi\.encodeWithSelector\s*\(\s*(\w+)\.(\w+)\.selector(?:\s*,\s*([^)]+))?\s*\)\s*\)/g;

// Input:  addToBatch(emergencyAddress, abi.encodeWithSelector(IEmergency.shutdownWithdrawals.selector))
// Output: {
//   addressVar: "emergencyAddress",
//   interface: "IEmergency",
//   function: "shutdownWithdrawals",
//   args: []
// }

// Input:  addToBatch(coolerAddress, abi.encodeWithSelector(IMonoCooler.setBorrowPaused.selector, true))
// Output: {
//   addressVar: "coolerAddress",
//   interface: "IMonoCooler",
//   function: "setBorrowPaused",
//   args: [true]
// }
```

#### 3. Parse Markdown sections

```typescript
// Pattern: ### Component Name
const componentHeaderPattern = /^###\s+(.+)$/gm;

// Pattern: - **Script:** `script-name`
const scriptPattern = /\*\*Script:\*\*\s*`([^`]+)`/;

// Pattern: - **Multisig:** Emergency MS or DAO MS
const multisigPattern = /\*\*Multisig:\*\*\s*(Emergency MS|DAO MS)/i;

// Pattern: - **Function:** `functionName()`
const functionPattern = /\*\*Function:\*\*\s*`([^`]+)`/;

// Pattern: - **Purpose:** Description text
const purposePattern = /\*\*Purpose:\*\*\s*(.+)/;
```

### Mapping envPath to Contract Keys

The script maps `envAddress()` paths to simplified contract keys:

```typescript
const ENV_PATH_TO_KEY: Record<string, string> = {
  "olympus.policies.Emergency": "emergency",
  "olympus.policies.Heart": "heart",
  "olympus.policies.EmissionManager": "emissionManager",
  "olympus.cooler-v2.MonoCooler": "monoCooler",
  "olympus.cooler-v2.Composites": "coolerComposites",
  "olympus.cooler-v2.Migrator": "coolerMigrator",
  "olympus.ccip.CrossChainBridge": "ccipBridge",
  // ... more mappings extracted from env.json structure
};
```

### Determining Available Chains

For each component, available chains are determined by:

1. Check which chains have the required contract addresses in env.json
2. A component is available on a chain only if ALL its required contracts exist

```typescript
function getAvailableChains(component: ParsedComponent, addresses: Record<string, ChainAddresses>): string[] {
  return Object.entries(addresses)
    .filter(([chainName, chainAddresses]) => {
      // Check if all required contracts exist for this chain
      return component.calls.every(call =>
        chainAddresses[call.contractKey] &&
        chainAddresses[call.contractKey] !== ""
      );
    })
    .map(([chainName]) => chainName);
}
```

### Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "codegen:emergency": "ts-node scripts/emergency-codegen.ts && yarn lint:fix",
    "codegen": "yarn codegen:bundle-cooler && yarn codegen:bundle-units && orval && yarn codegen:emergency && yarn lint:fix"
  }
}
```

### Example: What Happens When olympus-v3 Changes

**Scenario: New component `ReserveWrapper.sol` added**

1. Run `yarn codegen:emergency`
2. Script fetches file list from `src/scripts/emergency/`
3. Discovers new file `ReserveWrapper.sol`
4. Parses it: extracts `envAddress()` and `addToBatch()` calls
5. Finds matching section in `EMERGENCY_SHUTDOWN.md`
6. Determines available chains from `env.json`
7. Generates updated `components.ts` with new component
8. Done - no manual code changes needed!

**Scenario: Component `Heart.sol` removed**

1. Run `yarn codegen:emergency`
2. Script fetches file list - `Heart.sol` no longer exists
3. Generated `components.ts` won't include Heart
4. Done - automatically removed!

**Scenario: New chain `polygon` added with Emergency contracts**

1. Run `yarn codegen:emergency`
2. Script parses `env.json` - finds new `polygon` section with addresses
3. For each component, checks if polygon has required addresses
4. Updates `addresses.ts` with polygon addresses
5. Updates components' `chains` arrays to include "polygon" where applicable
6. Done - new chain automatically supported!

## UI Components

### File Structure

```
src/views/EmergencyShutdown/
├── index.tsx                        # Lazy-load entry point
├── EmergencyShutdownPage.tsx        # Main page component
├── components/
│   ├── ChainSelector.tsx            # Network dropdown
│   ├── SignerStatus.tsx             # Display signer permissions
│   ├── ComponentFilters.tsx         # Filter by owner/search
│   ├── ComponentCard.tsx            # Single component display
│   ├── ComponentList.tsx            # List of components
│   ├── ShutdownButton.tsx           # The shutdown action button
│   ├── ShutdownConfirmModal.tsx     # Confirmation dialog
│   └── TransactionStatus.tsx        # Success/pending state
├── hooks/
│   ├── useEmergencyComponents.ts    # Filter/search logic
│   ├── useSafeSignerStatus.ts       # Check Safe signer status
│   ├── useCreateShutdownTx.ts       # Build Safe transaction
│   └── useSupportedChain.ts         # Check if chain supported
└── constants.ts                     # UI constants
```

### Routing

Add to `src/App.tsx`:

```tsx
const EmergencyShutdownPage = lazy(() => import("src/views/EmergencyShutdown"));

// In routes:
<Route path="/emergency" element={<EmergencyShutdownPage />} />
```

### Navigation

Add to sidebar (optional - may want to keep this hidden/unlisted):

```tsx
// Only show to connected wallets, or keep as unlisted route
{
  title: "Emergency",
  path: "/emergency",
  icon: <WarningIcon />,
}
```

## Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "@safe-global/api-kit": "^2.0.0",
    "@safe-global/protocol-kit": "^3.0.0",
    "@safe-global/safe-core-sdk-types": "^4.0.0"
  }
}
```

## Environment Variables

Add the following to your `.env` file:

```env
# Safe Transaction Service API Key (optional but recommended)
# Get your API key from: https://safe.global/ → Developer Portal → API Keys
VITE_OLYMPUS_SAFE_API_KEY=your-api-key-here
```

### Usage in Code

```typescript
// hooks/useSafeApiKit.ts
import SafeApiKit from "@safe-global/api-kit";

export const createSafeApiKit = (chainId: number) => {
  const apiKey = import.meta.env.VITE_OLYMPUS_SAFE_API_KEY;

  return new SafeApiKit({
    chainId: BigInt(chainId),
    // API key is optional - Safe API works without it but may have rate limits
    ...(apiKey && { apiKey }),
  });
};
```

### Notes

| With API Key | Without API Key |
|--------------|-----------------|
| Higher rate limits | Lower rate limits |
| Recommended for production | OK for development |
| Required for some enterprise features | Basic features work |

The Safe Transaction Service will work without an API key, but having one is recommended for production use to avoid rate limiting issues.

## User Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER FLOW                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. User navigates to /emergency                                     │
│                    │                                                 │
│                    ▼                                                 │
│  2. Connect wallet (if not connected)                                │
│                    │                                                 │
│                    ▼                                                 │
│  3. Select chain from dropdown                                       │
│                    │                                                 │
│                    ▼                                                 │
│  4. Dashboard checks Safe API:                                       │
│     - Is user a signer on Emergency MS?                              │
│     - Is user a signer on DAO MS?                                    │
│                    │                                                 │
│                    ▼                                                 │
│  5. Display components filtered by chain                             │
│     - Show "INITIATE SHUTDOWN" for components user can sign          │
│     - Show "NOT A SIGNER" for others                                 │
│                    │                                                 │
│                    ▼                                                 │
│  6. User clicks "INITIATE SHUTDOWN" on a component                   │
│                    │                                                 │
│                    ▼                                                 │
│  7. Confirmation modal shows:                                        │
│     - Component name                                                 │
│     - Actions to be executed                                         │
│     - Warning message                                                │
│                    │                                                 │
│                    ▼                                                 │
│  8. User confirms → Sign transaction with wallet                     │
│                    │                                                 │
│                    ▼                                                 │
│  9. Transaction proposed to Safe Transaction Service                 │
│                    │                                                 │
│                    ▼                                                 │
│  10. Success screen with link to Safe UI                             │
│      "Open in Safe App →"                                            │
│                    │                                                 │
│                    ▼                                                 │
│  11. Other signers sign in Safe UI                                   │
│                    │                                                 │
│                    ▼                                                 │
│  12. Once threshold reached → Execute                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Signer Permissions Matrix

The dashboard checks both Emergency MS and DAO MS signer status independently. A wallet can be a signer on one, both, or neither multisig.

### Permission Scenarios

| Emergency MS | DAO MS | Can Shutdown |
|--------------|--------|--------------|
| ✅ Signer | ❌ Not signer | Only Emergency MS components (Treasury, Minter, Cooler V2, etc.) |
| ❌ Not signer | ✅ Signer | Only DAO MS components (LayerZero Bridge, Cooler V2 Periphery, etc.) |
| ✅ Signer | ✅ Signer | **All components** |
| ❌ Not signer | ❌ Not signer | None (all buttons show "NOT A SIGNER") |

### UI Display for Dual Signer

When a wallet is a signer on **both** multisigs, the UI shows:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Your permissions:                                                   │
│                                                                      │
│  ✅ Emergency MS signer (3/5 threshold)                             │
│  ✅ DAO MS signer (4/9 threshold)                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Treasury (TRSRY)                                   Emergency MS 🟢  │
│ Prevent unauthorized treasury withdrawals                           │
│                                         [🔴 INITIATE SHUTDOWN]      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ LayerZero Bridge                                        DAO MS 🟢  │
│ Disable LayerZero cross-chain bridging                              │
│                                         [🔴 INITIATE SHUTDOWN]      │
└─────────────────────────────────────────────────────────────────────┘
```

### Permission Check Logic

```typescript
// Check signer status for both multisigs
const emergencyMsStatus = useSafeSignerStatus(addresses.emergency_ms);
const daoMsStatus = useSafeSignerStatus(addresses.dao_ms);

// Determine if user can sign for a specific component
const canSignComponent = (component: EmergencyComponent): boolean => {
  if (component.owner === "emergency_ms") {
    return emergencyMsStatus.isSigner;
  }
  if (component.owner === "dao_ms") {
    return daoMsStatus.isSigner;
  }
  return false;
};
```

### SignerStatus Component

```tsx
export const SignerStatus = ({ emergencyMs, daoMs }: SignerStatusProps) => {
  const hasAnyPermission = emergencyMs.isSigner || daoMs.isSigner;

  if (!hasAnyPermission) {
    return (
      <Alert severity="warning">
        Your wallet is not a signer on any protocol multisig.
        You can view components but cannot initiate shutdowns.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1">Your permissions:</Typography>

      <Box display="flex" gap={2} mt={1}>
        <Chip
          icon={emergencyMs.isSigner ? <CheckIcon /> : <LockIcon />}
          label={`Emergency MS ${emergencyMs.isSigner ? `(${emergencyMs.threshold}/${emergencyMs.totalSigners})` : ""}`}
          color={emergencyMs.isSigner ? "success" : "default"}
          variant={emergencyMs.isSigner ? "filled" : "outlined"}
        />

        <Chip
          icon={daoMs.isSigner ? <CheckIcon /> : <LockIcon />}
          label={`DAO MS ${daoMs.isSigner ? `(${daoMs.threshold}/${daoMs.totalSigners})` : ""}`}
          color={daoMs.isSigner ? "success" : "default"}
          variant={daoMs.isSigner ? "filled" : "outlined"}
        />
      </Box>
    </Box>
  );
};
```

## Security Considerations

1. **No automatic execution**: Dashboard only proposes transactions, never executes directly
2. **Multi-sig required**: All shutdowns require multiple signers
3. **Clear warnings**: UI clearly shows what actions will be taken
4. **Confirmation required**: Two-step confirmation before proposing
5. **Audit trail**: All transactions visible in Safe Transaction Service

## Updating Configuration

When the olympus-v3 documentation changes:

1. Someone runs `yarn codegen:emergency`
2. Review generated changes in `src/generated/emergency/`
3. Commit and create PR
4. CI validates types compile correctly

### Automated Updates (Optional)

Can add GitHub Action to check for updates:

```yaml
# .github/workflows/check-emergency-docs.yml
name: Check Emergency Docs Updates

on:
  schedule:
    - cron: "0 0 * * *" # Daily

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: yarn install
      - run: yarn codegen:emergency
      - name: Check for changes
        run: |
          if [[ -n $(git status --porcelain src/generated/emergency/) ]]; then
            echo "Emergency config has updates!"
            # Create PR or notify
          fi
```

## Testing

### Unit Tests

```typescript
// src/views/EmergencyShutdown/__tests__/useEmergencyComponents.test.ts
describe("useEmergencyComponents", () => {
  it("filters components by chain", () => {
    const { result } = renderHook(() =>
      useEmergencyComponents(EMERGENCY_COMPONENTS, "mainnet")
    );

    expect(result.current.filteredComponents).toContainEqual(
      expect.objectContaining({ id: "treasury" })
    );
  });

  it("filters by owner", () => {
    const { result } = renderHook(() =>
      useEmergencyComponents(EMERGENCY_COMPONENTS, "mainnet")
    );

    act(() => {
      result.current.setOwnerFilter("emergency_ms");
    });

    result.current.filteredComponents.forEach((c) => {
      expect(c.owner).toBe("emergency_ms");
    });
  });
});
```

### Integration Tests

Test with Safe Transaction Service testnet API to verify transaction creation flow.

## Troubleshooting

### Common Issues

1. **"Not a signer" for all components**
   - Verify wallet is connected to correct network
   - Verify wallet address is in Safe signers list

2. **Transaction proposal fails**
   - Check Safe Transaction Service is available for chain
   - Verify contract addresses are correct for chain

3. **Codegen fails**
   - Check GitHub raw URLs are accessible
   - Verify olympus-v3 emergency branch exists

### Debug Mode

Add `?debug=true` to URL to show:
- Raw component data
- Contract addresses being used
- Safe API responses
