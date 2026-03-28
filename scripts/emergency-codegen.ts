/**
 * Emergency Shutdown Dashboard - Code Generator
 *
 * This script fetches the centralized emergency configuration from olympus-v3
 * and generates TypeScript files for the Emergency Shutdown Dashboard.
 *
 * Run with: yarn codegen:emergency
 *
 * Data sources (olympus-v3 repo):
 * - documentation/emergency/emergency-config.json - Components, chains, addresses
 * - documentation/emergency/emergency-abis.json - ABIs for shutdown functions
 *
 */

import * as fs from "fs";
import * as path from "path";

// =============================================================================
// Configuration
// =============================================================================

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/OlympusDAO/olympus-v3/emergency";
const CONFIG_URL = `${GITHUB_RAW_BASE}/documentation/emergency/emergency-config.json`;
const ABIS_URL = `${GITHUB_RAW_BASE}/documentation/emergency/emergency-abis.json`;

const OUTPUT_DIR = path.join(__dirname, "../src/generated/emergency");

// Chain ID mappings
const CHAIN_NAME_TO_ID: Record<string, number> = {
  mainnet: 1,
  arbitrum: 42161,
  base: 8453,
  berachain: 80094,
  optimism: 10,
  sepolia: 11155111,
  "arbitrum-sepolia": 421614,
  "base-sepolia": 84532,
  "berachain-bartio": 80084,
  goerli: 5,
};

// =============================================================================
// Types - Remote (from olympus-v3 JSON)
// =============================================================================

interface RemoteCallArg {
  name: string;
  type: string;
  value: unknown;
  envKey?: string;
}

interface RemoteFunctionCall {
  contractKey: string;
  function: string;
  signature: string;
  args: RemoteCallArg[];
  abi: string;
}

interface RemoteComponent {
  id: string;
  name: string;
  description: string;
  category: "treasury" | "lending" | "bridge" | "emissions" | "core" | "reserve";
  severity: "critical" | "high" | "medium" | "low";
  owner: "emergency" | "dao";
  shutdownCriteria?: string[];
  postShutdownSteps?: string[];
  dependencies?: string[];
  batchScript?: string;
  calls: RemoteFunctionCall[];
  availableOn: string[];
}

interface RemoteChainConfig {
  chainId: number;
  multisigs: {
    emergency: string;
    dao: string;
  };
  contracts: Record<string, string>;
}

interface RemoteEmergencyConfig {
  version: string;
  lastUpdated: string;
  updatedBy: string;
  metadata: {
    description: string;
    repository: string;
    docsUrl: string;
  };
  chains: Record<string, RemoteChainConfig>;
  contractRegistry: string[];
  components: RemoteComponent[];
  abiFile: string;
}

// =============================================================================
// Types - Local (for frontend)
// =============================================================================

type MultisigOwner = "emergency_ms" | "dao_ms";

interface EmergencyCall {
  contractKey: string;
  functionName: string;
  args: unknown[];
  abiKey: string;
}

interface EmergencyComponent {
  id: string;
  name: string;
  description: string;
  shutdownCriteria: string[];
  owner: MultisigOwner;
  chains: string[];
  calls: EmergencyCall[];
  // New optional fields
  category?: string;
  severity?: string;
  batchScript?: string;
  dependencies?: string[];
  postShutdownSteps?: string[];
}

interface ChainAddresses {
  emergency_ms: string;
  dao_ms: string;
  [key: string]: string;
}

// =============================================================================
// Fetch Utilities
// =============================================================================

async function fetchJson<T>(url: string): Promise<T> {
  console.log(`   Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// =============================================================================
// Conversion Functions
// =============================================================================

/**
 * Converts owner from new format to legacy format for backward compatibility
 */
function convertOwner(owner: "emergency" | "dao"): MultisigOwner {
  return owner === "emergency" ? "emergency_ms" : "dao_ms";
}

/**
 * Extracts contract key from dot-notation path
 * Example: "olympus.policies.Emergency" → "Emergency"
 */
function extractContractKey(key: string): string {
  const parts = key.split(".");
  return parts[parts.length - 1];
}

/**
 * Converts remote component to local format
 */
function convertComponent(remote: RemoteComponent): EmergencyComponent {
  return {
    id: remote.id,
    name: remote.name,
    description: remote.description,
    shutdownCriteria: remote.shutdownCriteria || [`${remote.name} vulnerability detected`],
    owner: convertOwner(remote.owner),
    chains: remote.availableOn,
    calls: remote.calls.map(call => ({
      contractKey: extractContractKey(call.contractKey),
      functionName: call.function,
      args: call.args.map(arg => arg.value),
      abiKey: call.abi,
    })),
    // New optional fields
    category: remote.category,
    severity: remote.severity,
    batchScript: remote.batchScript,
    dependencies: remote.dependencies,
    postShutdownSteps: remote.postShutdownSteps,
  };
}

/**
 * Converts all remote components to local format
 */
function convertComponents(remoteComponents: RemoteComponent[]): EmergencyComponent[] {
  return remoteComponents.map(convertComponent);
}

/**
 * Converts remote chains config to local addresses format
 */
function convertChainAddresses(chains: Record<string, RemoteChainConfig>): Record<string, ChainAddresses> {
  const result: Record<string, ChainAddresses> = {};

  for (const [chainName, chain] of Object.entries(chains)) {
    result[chainName] = {
      emergency_ms: chain.multisigs.emergency,
      dao_ms: chain.multisigs.dao,
      ...chain.contracts,
    };

    // Update CHAIN_NAME_TO_ID if this is a new chain
    if (!CHAIN_NAME_TO_ID[chainName] && chain.chainId) {
      CHAIN_NAME_TO_ID[chainName] = chain.chainId;
    }
  }

  return result;
}

// =============================================================================
// File Generators
// =============================================================================

function generateTypesFile(chains: string[]): string {
  const chainIds = chains.map(name => `  | "${name}"`).join("\n");

  return `// Auto-generated by scripts/emergency-codegen.ts
// Do not edit manually - run "yarn codegen:emergency" to regenerate

export type ChainId =
${chainIds};

export type MultisigOwner = "emergency_ms" | "dao_ms";

export type ComponentCategory = "treasury" | "lending" | "bridge" | "emissions" | "core" | "reserve";
export type ComponentSeverity = "critical" | "high" | "medium" | "low";

export interface EmergencyCall {
  /** Key to look up contract address in EMERGENCY_ADDRESSES */
  contractKey: string;
  /** Function name to call */
  functionName: string;
  /** Arguments to pass to the function */
  args: unknown[];
  /** Key to look up ABI */
  abiKey: string;
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
  /** Component category */
  category?: ComponentCategory;
  /** Severity level */
  severity?: ComponentSeverity;
  /** Path to batch script in olympus-v3 */
  batchScript?: string;
  /** IDs of components this depends on */
  dependencies?: string[];
  /** Steps to take after shutdown */
  postShutdownSteps?: string[];
}

export interface ChainAddresses {
  emergency_ms: string;
  dao_ms: string;
  [contractKey: string]: string;
}
`;
}

function generateComponentsFile(components: EmergencyComponent[]): string {
  const componentsJson = JSON.stringify(components, null, 2);

  return `// Auto-generated by scripts/emergency-codegen.ts
// Do not edit manually - run "yarn codegen:emergency" to regenerate

import { EmergencyComponent } from "./types";

export const EMERGENCY_COMPONENTS: EmergencyComponent[] = ${componentsJson};
`;
}

function generateAddressesFile(addresses: Record<string, ChainAddresses>): string {
  const addressesJson = JSON.stringify(addresses, null, 2);

  const chainIdToName = Object.entries(CHAIN_NAME_TO_ID)
    .map(([name, id]) => `  ${id}: "${name}"`)
    .join(",\n");

  const chainNameToId = JSON.stringify(CHAIN_NAME_TO_ID, null, 2);

  return `// Auto-generated by scripts/emergency-codegen.ts
// Do not edit manually - run "yarn codegen:emergency" to regenerate

import { ChainAddresses } from "./types";

export const EMERGENCY_ADDRESSES: Record<string, ChainAddresses> = ${addressesJson};

export const CHAIN_ID_TO_NAME: Record<number, string> = {
${chainIdToName}
};

export const CHAIN_NAME_TO_ID: Record<string, number> = ${chainNameToId};

/**
 * Get addresses for a specific chain by chain ID
 */
export function getAddressesForChain(chainId: number): ChainAddresses | undefined {
  const chainName = CHAIN_ID_TO_NAME[chainId];
  if (!chainName) return undefined;
  return EMERGENCY_ADDRESSES[chainName];
}
`;
}

function generateIndexFile(abiKeys: string[]): string {
  const abiExports = abiKeys
    .map(name => {
      const camelName = name.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
      return `export { default as ${camelName}Abi } from "./abis/${name}.json";`;
    })
    .join("\n");

  return `// Auto-generated by scripts/emergency-codegen.ts
// Do not edit manually - run "yarn codegen:emergency" to regenerate

export * from "./types";
export * from "./components";
export * from "./addresses";

// ABIs
${abiExports}
`;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log("🚀 Emergency Shutdown Dashboard - Code Generator\n");
  console.log("=".repeat(60));
  console.log("Using centralized JSON config from olympus-v3\n");

  // 1. Create output directories
  console.log("📁 Creating output directories...");
  fs.mkdirSync(path.join(OUTPUT_DIR, "abis"), { recursive: true });
  console.log(`   Created: ${OUTPUT_DIR}`);

  // 2. Fetch emergency config
  console.log("\n📄 Fetching emergency config...");
  let config: RemoteEmergencyConfig;
  try {
    config = await fetchJson<RemoteEmergencyConfig>(CONFIG_URL);
    console.log(`   ✓ Version: ${config.version}`);
    console.log(`   ✓ Last updated: ${config.lastUpdated}`);
    console.log(`   ✓ Components: ${config.components.length}`);
    console.log(`   ✓ Chains: ${Object.keys(config.chains).length}`);
  } catch (error) {
    console.error("   ✗ Failed to fetch config:", error);
    process.exit(1);
  }

  // 3. Fetch ABIs
  console.log("\n📦 Fetching ABIs...");
  let abis: Record<string, unknown[]>;
  try {
    abis = await fetchJson<Record<string, unknown[]>>(ABIS_URL);
    console.log(`   ✓ Loaded ${Object.keys(abis).length} ABIs`);
  } catch (error) {
    console.error("   ✗ Failed to fetch ABIs:", error);
    process.exit(1);
  }

  // 4. Convert to frontend format
  console.log("\n🔧 Converting to frontend format...");
  const components = convertComponents(config.components);
  const addresses = convertChainAddresses(config.chains);
  console.log(`   ✓ Converted ${components.length} components`);
  console.log(`   ✓ Converted ${Object.keys(addresses).length} chains`);

  // 5. Generate TypeScript files
  console.log("\n📝 Generating TypeScript files...");

  // Get all unique chain names
  const allChains = new Set<string>();
  for (const chainName of Object.keys(addresses)) {
    allChains.add(chainName);
  }
  for (const comp of components) {
    for (const chain of comp.chains) {
      allChains.add(chain);
    }
  }

  // types.ts
  fs.writeFileSync(path.join(OUTPUT_DIR, "types.ts"), generateTypesFile([...allChains].sort()));
  console.log("   ✓ types.ts");

  // components.ts
  fs.writeFileSync(path.join(OUTPUT_DIR, "components.ts"), generateComponentsFile(components));
  console.log("   ✓ components.ts");

  // addresses.ts
  fs.writeFileSync(path.join(OUTPUT_DIR, "addresses.ts"), generateAddressesFile(addresses));
  console.log("   ✓ addresses.ts");

  // 6. Save ABIs
  console.log("\n📦 Saving ABI files...");
  const abiKeys: string[] = [];
  for (const [name, abi] of Object.entries(abis)) {
    const outputPath = path.join(OUTPUT_DIR, "abis", `${name}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(abi, null, 2));
    abiKeys.push(name);
    console.log(`   ✓ ${name}.json`);
  }

  // index.ts (needs ABI keys)
  fs.writeFileSync(path.join(OUTPUT_DIR, "index.ts"), generateIndexFile(abiKeys));
  console.log("   ✓ index.ts");

  // 7. Summary
  console.log("\n" + "=".repeat(60));
  console.log("✅ Code generation complete!\n");
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`\nGenerated:`);
  console.log(`  📄 ${components.length} emergency components`);
  console.log(`  🔗 ${Object.keys(addresses).length} chains with addresses`);
  console.log(`  📦 ${abiKeys.length} ABI files`);

  // List components
  console.log(`\nComponents:`);
  for (const comp of components) {
    const severity = comp.severity ? `[${comp.severity}]` : "";
    console.log(`  - ${comp.name} (${comp.id}) ${severity}: ${comp.calls.length} calls, ${comp.chains.length} chains`);
  }

  console.log(`\nNext steps:`);
  console.log(`  1. Run "yarn lint:fix" to format generated files`);
  console.log(`  2. Review generated files in src/generated/emergency/`);
  console.log(`  3. Commit changes if everything looks correct`);
}

main().catch(error => {
  console.error("\n❌ Code generation failed:", error);
  process.exit(1);
});
