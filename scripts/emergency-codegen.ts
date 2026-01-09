/**
 * Emergency Shutdown Dashboard - Code Generator
 *
 * This script automatically parses source files from the olympus-v3 repository
 * and generates TypeScript files for the Emergency Shutdown Dashboard.
 *
 * Run with: yarn codegen:emergency
 *
 * What it does:
 * 1. Discovers all Solidity files in src/scripts/emergency/
 * 2. Parses each .sol file to extract _envAddressNotZero() and addToBatch() calls
 * 3. Parses EMERGENCY_SHUTDOWN.md for component metadata
 * 4. Parses env.json for contract addresses (including multisig addresses)
 * 5. Fetches all ABIs from documentation/emergency/abis/
 * 6. Generates TypeScript files in src/generated/emergency/
 *
 */

import * as fs from "fs";
import * as path from "path";

// =============================================================================
// Configuration
// =============================================================================

const GITHUB_API_BASE = "https://api.github.com/repos/OlympusDAO/olympus-v3/contents";
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/OlympusDAO/olympus-v3/emergency";
const BRANCH = "emergency";

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
// Types
// =============================================================================

interface ParsedEnvAddress {
  /** Local variable name in Solidity (e.g., "bridgeAddress") */
  variable: string;
  /** Full env path (e.g., "olympus.periphery.CCIPCrossChainBridge") */
  envPath: string;
  /** Extracted contract key for matching with env.json (e.g., "CCIPCrossChainBridge") */
  contractKey: string;
}

interface ParsedBatchCall {
  addressVariable: string;
  interfaceName: string;
  functionName: string;
  args: string[];
}

interface ParsedSolidityFile {
  fileName: string;
  componentId: string;
  envAddresses: ParsedEnvAddress[];
  batchCalls: ParsedBatchCall[];
}

interface MarkdownComponentInfo {
  id: string;
  name: string;
  description: string;
  owner: "emergency_ms" | "dao_ms";
  shutdownCriteria: string[];
}


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
  owner: "emergency_ms" | "dao_ms";
  chains: string[];
  calls: EmergencyCall[];
}

interface ChainAddresses {
  emergency_ms: string;
  dao_ms: string;
  [key: string]: string;
}

interface GitHubFileInfo {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
}

// =============================================================================
// Fetch Utilities
// =============================================================================

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function fetchGitHubDirectory(dirPath: string): Promise<GitHubFileInfo[]> {
  const url = `${GITHUB_API_BASE}/${dirPath}?ref=${BRANCH}`;
  console.log(`   Fetching directory: ${dirPath}`);
  return fetchJson<GitHubFileInfo[]>(url);
}

// =============================================================================
// Solidity Parsing
// =============================================================================

/**
 * Extracts the contract key from an env path
 * Example: "olympus.periphery.CCIPCrossChainBridge" → "CCIPCrossChainBridge"
 */
function extractContractKeyFromEnvPath(envPath: string): string {
  const parts = envPath.split(".");
  return parts[parts.length - 1];
}

/**
 * Generates a component ID from filename
 * Handles consecutive capitals correctly:
 * - "CCIPBridge.sol" → "ccip-bridge"
 * - "CoolerV2.sol" → "cooler-v2"
 */
function fileNameToComponentId(fileName: string): string {
  return (
    fileName
      .replace(".sol", "")
      // Insert hyphen before uppercase letters that follow lowercase letters
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      // Insert hyphen before uppercase letters that are followed by lowercase (handles "CCIPBridge" → "CCIP-Bridge")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
      // Insert hyphen before numbers
      .replace(/([a-zA-Z])(\d)/g, "$1-$2")
      .toLowerCase()
  );
}

/**
 * Parses a Solidity emergency shutdown script file
 */
function parseSolidityFile(content: string, fileName: string): ParsedSolidityFile {
  const componentId = fileNameToComponentId(fileName);

  // Parse _envAddressNotZero() calls
  // Pattern: address someVar = _envAddressNotZero("olympus.periphery.CCIPCrossChainBridge");
  // Also handles: _envAddressNotZero("olympus.policies.Emergency")
  const envAddressPattern = /(\w+)\s*=\s*_envAddressNotZero\s*\(\s*["']([^"']+)["']\s*\)/g;
  const envAddresses: ParsedEnvAddress[] = [];

  let match;
  while ((match = envAddressPattern.exec(content)) !== null) {
    const envPath = match[2];
    envAddresses.push({
      variable: match[1],
      envPath,
      // Fix #2: Extract the actual contract key from the env path
      contractKey: extractContractKeyFromEnvPath(envPath),
    });
  }

  // Parse addToBatch() calls
  // Pattern: addToBatch(addressVar, abi.encodeWithSelector(Interface.function.selector, args...))
  const addToBatchPattern =
    /addToBatch\s*\(\s*(\w+)\s*,\s*abi\.encodeWithSelector\s*\(\s*(\w+)\.(\w+)\.selector(?:\s*,\s*([^)]+))?\s*\)\s*\)/g;
  const batchCalls: ParsedBatchCall[] = [];

  while ((match = addToBatchPattern.exec(content)) !== null) {
    const args = match[4] ? match[4].split(",").map(a => a.trim()) : [];
    batchCalls.push({
      addressVariable: match[1],
      interfaceName: match[2],
      functionName: match[3],
      args,
    });
  }

  return {
    fileName,
    componentId,
    envAddresses,
    batchCalls,
  };
}

// =============================================================================
// Markdown Parsing
// =============================================================================

/**
 * Parses EMERGENCY_SHUTDOWN.md to extract component metadata
 */
function parseMarkdown(content: string): Map<string, MarkdownComponentInfo> {
  const components = new Map<string, MarkdownComponentInfo>();

  // Split into sections by ### headers
  const sections = content.split(/(?=^### )/gm);

  for (const section of sections) {
    if (!section.startsWith("### ")) continue;

    // Extract component name from header
    // Pattern: "### Component Name - Shutdown Steps" or "### Component Name"
    const headerMatch = section.match(/^### ([^-\n]+?)(?:\s*-\s*Shutdown Steps)?(?:\n|$)/);
    if (!headerMatch) continue;

    const name = headerMatch[1].trim();

    // Extract batch script path to derive component ID
    // Pattern: "Batch script: `src/scripts/emergency/Treasury.sol`"
    const scriptMatch = section.match(/[Bb]atch\s+[Ss]cript[:\s]+`[^`]*\/(\w+)\.sol`/);
    let id: string;
    if (scriptMatch) {
      // Convert filename to component ID: "Treasury" → "treasury", "CCIPBridge" → "ccip-bridge"
      id = fileNameToComponentId(scriptMatch[1] + ".sol");
    } else {
      // Fallback: derive from name
      id = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    // Extract multisig owner
    // Pattern: "**Multisig:** Emergency MS" or "Required role: emergency_admin"
    const multisigMatch = section.match(
      /(?:\*\*Multisig:\*\*|Required\s+role:)\s*(Emergency|DAO|emergency_admin|dao_admin)/i,
    );
    const owner: "emergency_ms" | "dao_ms" = multisigMatch
      ? multisigMatch[1].toLowerCase().includes("emergency")
        ? "emergency_ms"
        : "dao_ms"
      : "emergency_ms";

    // Extract purpose/description from first paragraph after header
    const descriptionMatch = section.match(/^### [^\n]+\n+([^#*\n][^\n]+)/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : `Emergency shutdown for ${name}`;

    // Extract shutdown criteria (look for bullet points in "When to Shutdown" sections)
    const shutdownCriteria: string[] = [];
    const criteriaSection = section.match(
      /(?:When to [Ss]hutdown|Shutdown [Ww]hen|[Cc]riteria|[Ww]hen to use)[:\s]*\n((?:[-*]\s*.+\n?)+)/i,
    );
    if (criteriaSection) {
      const bullets = criteriaSection[1].match(/[-*]\s*(.+)/g);
      if (bullets) {
        for (const bullet of bullets) {
          const text = bullet.replace(/^[-*]\s*/, "").trim();
          if (text) shutdownCriteria.push(text);
        }
      }
    }

    // If no criteria found, add default
    if (shutdownCriteria.length === 0) {
      shutdownCriteria.push(`${name} vulnerability or compromise detected`);
    }

    components.set(id, {
      id,
      name,
      description,
      owner,
      shutdownCriteria,
    });

    // Also add with original name as key for better matching
    const altId = name.toLowerCase().replace(/\s+/g, "");
    if (altId !== id) {
      components.set(altId, {
        id,
        name,
        description,
        owner,
        shutdownCriteria,
      });
    }
  }

  return components;
}

// =============================================================================
// Address Extraction
// =============================================================================

/**
 * Recursively extracts all addresses from a nested object
 * and flattens them into a single-level object with the key being the last part of the path
 *
 * Example:
 * { policies: { Emergency: "0x..." } } → { Emergency: "0x..." }
 */
function flattenAddresses(
  obj: Record<string, unknown>,
  result: Record<string, string> = {},
  prefix = "",
): Record<string, string> {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && value.startsWith("0x")) {
      // This is an address - use the key directly
      result[key] = value;
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recurse into nested objects
      flattenAddresses(value as Record<string, unknown>, result, `${prefix}${key}.`);
    }
  }
  return result;
}

/**
 * Maps interface names to ABI file keys
 */
function interfaceToAbiKey(interfaceName: string): string {
  const mappings: Record<string, string> = {
    IEmergency: "emergency",
    IMonoCooler: "cooler_v2",
    IHeart: "heart",
    IEmissionManager: "emission_manager",
    ICrossChainBridge: "cross_chain_bridge",
    IPeripheryEnabler: "periphery_enabler",
    IReserveMigrator: "reserve_migrator",
    IYieldRepurchaseFacility: "yield_repurchase_facility",
    IBondManager: "bond_manager",
    IEnabler: "periphery_enabler",
  };

  return mappings[interfaceName] || interfaceName.replace(/^I/, "").toLowerCase();
}

/**
 * Extract addresses from env.json
 *
 * The env.json structure is:
 * {
 *   current: {
 *     mainnet: {
 *       olympus: {
 *         multisig: { DAO: "0x...", emergency: "0x..." },
 *         policies: { Emergency: "0x...", Heart: "0x..." },
 *         periphery: { CCIPCrossChainBridge: "0x..." },
 *         "cooler-v2": { MonoCooler: "0x..." },
 *         ...
 *       }
 *     }
 *   }
 * }
 */
function extractAddresses(envJson: Record<string, unknown>): Record<string, ChainAddresses> {
  const addresses: Record<string, ChainAddresses> = {};

  // Get the "current" section which has the latest addresses
  const current = envJson.current as Record<string, unknown> | undefined;
  if (!current) {
    console.warn("   Warning: No 'current' section found in env.json");
    return addresses;
  }

  // Process each chain
  for (const [chainName, chainData] of Object.entries(current)) {
    if (typeof chainData !== "object" || chainData === null) continue;

    const data = chainData as Record<string, unknown>;
    const chainAddresses: ChainAddresses = {
      emergency_ms: "",
      dao_ms: "",
    };

    // Extract all addresses from olympus section using recursive flattening
    const olympus = data.olympus as Record<string, unknown> | undefined;
    if (olympus) {
      // Flatten all nested addresses
      const flatAddresses = flattenAddresses(olympus);

      // Copy all flattened addresses to chainAddresses
      for (const [key, value] of Object.entries(flatAddresses)) {
        chainAddresses[key] = value;
      }

      // Fix #4: Extract multisig addresses from olympus/multisig/ section
      // The keys are "DAO" and "emergency" (not "dao_ms" and "emergency_ms")
      const multisig = olympus.multisig as Record<string, string> | undefined;
      if (multisig) {
        chainAddresses.emergency_ms = multisig.emergency || multisig.Emergency || "";
        chainAddresses.dao_ms = multisig.DAO || multisig.dao || "";
      }
    }

    addresses[chainName] = chainAddresses;
  }

  return addresses;
}

// =============================================================================
// Component Building
// =============================================================================

/**
 * Builds emergency components by combining:
 * - Parsed Solidity file data (function calls, contract keys)
 * - Markdown metadata (descriptions, shutdown criteria)
 * - Address data (which chains have these contracts)
 */
function buildComponents(
  parsedFiles: ParsedSolidityFile[],
  markdownInfo: Map<string, MarkdownComponentInfo>,
  addresses: Record<string, ChainAddresses>,
): EmergencyComponent[] {
  const components: EmergencyComponent[] = [];

  for (const parsed of parsedFiles) {
    // Build variable to contract key mapping
    // Fix #2: Use contractKey from ParsedEnvAddress (extracted from envPath)
    const varToContractKey: Record<string, string> = {};
    for (const env of parsed.envAddresses) {
      varToContractKey[env.variable] = env.contractKey;
    }

    // Build calls
    const calls: EmergencyCall[] = parsed.batchCalls.map(call => ({
      contractKey: varToContractKey[call.addressVariable] || call.addressVariable,
      functionName: call.functionName,
      args: call.args.map(arg => {
        // Parse argument values
        if (arg === "true") return true;
        if (arg === "false") return false;
        if (arg.startsWith('"') || arg.startsWith("'")) return arg.slice(1, -1);
        if (!isNaN(Number(arg))) return Number(arg);
        return arg;
      }),
      abiKey: interfaceToAbiKey(call.interfaceName),
    }));

    // Skip if no calls found
    if (calls.length === 0) {
      console.log(`   Skipping ${parsed.fileName}: no addToBatch calls found`);
      continue;
    }

    // Get metadata from markdown (try multiple keys for better matching)
    let mdInfo = markdownInfo.get(parsed.componentId);
    if (!mdInfo) {
      // Try with filename without extension
      const altKey = parsed.fileName.replace(".sol", "").toLowerCase();
      mdInfo = markdownInfo.get(altKey);
    }

    // Determine available chains
    // A chain is available if it has non-zero addresses for ALL required contracts
    const requiredContracts = [...new Set(calls.map(c => c.contractKey))];
    const availableChains = Object.entries(addresses)
      .filter(([, chainAddresses]) => {
        return requiredContracts.every(contractKey => {
          const addr = chainAddresses[contractKey];
          // Address must exist and not be zero address
          return addr && addr !== "" && addr !== "0x0000000000000000000000000000000000000000";
        });
      })
      .map(([chainName]) => chainName);

    const component: EmergencyComponent = {
      id: parsed.componentId,
      name: mdInfo?.name || formatComponentName(parsed.fileName),
      description: mdInfo?.description || `Emergency shutdown for ${formatComponentName(parsed.fileName)}`,
      shutdownCriteria: mdInfo?.shutdownCriteria || [`${formatComponentName(parsed.fileName)} vulnerability detected`],
      owner: mdInfo?.owner || "emergency_ms",
      chains: availableChains,
      calls,
    };

    components.push(component);
  }

  return components;
}

/**
 * Formats a component name from filename or ID
 */
function formatComponentName(input: string): string {
  // Remove .sol extension if present
  const name = input.replace(".sol", "");

  // If it's a hyphenated ID, convert to words
  if (name.includes("-")) {
    return name
      .split("-")
      .map(word => {
        // Handle all-caps words like "CCIP"
        if (word === word.toUpperCase() && word.length > 1) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  // Otherwise, split camelCase/PascalCase
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2") // "coolerV2" → "cooler V2"
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // "CCIPBridge" → "CCIP Bridge"
    .replace(/(\d+)/g, " $1") // "V2" → "V 2" then cleanup
    .replace(/\s+/g, " ")
    .trim();
}

// =============================================================================
// File Generators
// =============================================================================

function generateTypesFile(): string {
  const chainIds = Object.keys(CHAIN_NAME_TO_ID)
    .map(name => `  | "${name}"`)
    .join("\n");

  return `// Auto-generated by scripts/emergency-codegen.ts
// Do not edit manually - run "yarn codegen:emergency" to regenerate

export type ChainId =
${chainIds};

export type MultisigOwner = "emergency_ms" | "dao_ms";

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

function generateIndexFile(abiFiles: string[]): string {
  const abiExports = abiFiles
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

  // 1. Create output directories
  console.log("\n📁 Creating output directories...");
  fs.mkdirSync(path.join(OUTPUT_DIR, "abis"), { recursive: true });
  console.log(`   Created: ${OUTPUT_DIR}`);

  // 2. Discover and fetch Solidity files
  console.log("\n📄 Discovering Solidity files...");
  let solidityFiles: GitHubFileInfo[];
  try {
    solidityFiles = await fetchGitHubDirectory("src/scripts/emergency");
    solidityFiles = solidityFiles.filter(
      f => f.type === "file" && f.name.endsWith(".sol") && !f.name.startsWith("I") && f.name !== "IEmergencyBatch.sol",
    );
    console.log(`   Found ${solidityFiles.length} Solidity files`);
  } catch (error) {
    console.error("   Failed to fetch Solidity files directory:", error);
    solidityFiles = [];
  }

  // 3. Parse each Solidity file
  console.log("\n🔍 Parsing Solidity files...");
  const parsedFiles: ParsedSolidityFile[] = [];
  for (const file of solidityFiles) {
    try {
      const content = await fetchText(`${GITHUB_RAW_BASE}/src/scripts/emergency/${file.name}`);
      const parsed = parseSolidityFile(content, file.name);
      parsedFiles.push(parsed);
      console.log(`   ✓ ${file.name}: ${parsed.envAddresses.length} addresses, ${parsed.batchCalls.length} calls`);
    } catch (error) {
      console.error(`   ✗ Failed to parse ${file.name}:`, error);
    }
  }

  // 4. Fetch and parse markdown documentation
  console.log("\n📖 Fetching documentation...");
  let markdownInfo = new Map<string, MarkdownComponentInfo>();
  try {
    const markdown = await fetchText(`${GITHUB_RAW_BASE}/documentation/emergency/EMERGENCY_SHUTDOWN.md`);
    markdownInfo = parseMarkdown(markdown);
    console.log(`   ✓ Parsed ${markdownInfo.size} component descriptions`);
  } catch (error) {
    console.error("   ✗ Failed to fetch markdown:", error);
  }

  // 5. Fetch env.json for addresses
  console.log("\n📍 Fetching contract addresses...");
  let addresses: Record<string, ChainAddresses> = {};
  try {
    const envJson = await fetchJson<Record<string, unknown>>(`${GITHUB_RAW_BASE}/src/scripts/env.json`);
    addresses = extractAddresses(envJson);
    console.log(`   ✓ Extracted addresses for ${Object.keys(addresses).length} chains`);
  } catch (error) {
    console.error("   ✗ Failed to fetch env.json:", error);
  }

  // 6. Discover and fetch ABIs
  console.log("\n📦 Fetching ABIs...");
  const abiFiles: string[] = [];
  try {
    const abiDir = await fetchGitHubDirectory("documentation/emergency/abis");
    const jsonFiles = abiDir.filter(f => f.type === "file" && f.name.endsWith(".json"));

    for (const file of jsonFiles) {
      try {
        const abi = await fetchJson(`${GITHUB_RAW_BASE}/documentation/emergency/abis/${file.name}`);
        const outputPath = path.join(OUTPUT_DIR, "abis", file.name);
        fs.writeFileSync(outputPath, JSON.stringify(abi, null, 2));
        abiFiles.push(file.name.replace(".json", ""));
        console.log(`   ✓ ${file.name}`);
      } catch (error) {
        console.error(`   ✗ Failed to fetch ${file.name}:`, error);
      }
    }
  } catch (error) {
    console.error("   ✗ Failed to fetch ABI directory:", error);
  }

  // 7. Build components
  console.log("\n🔧 Building components...");
  const components = buildComponents(parsedFiles, markdownInfo, addresses);
  console.log(`   ✓ Built ${components.length} components`);

  // 8. Generate TypeScript files
  console.log("\n📝 Generating TypeScript files...");

  // types.ts
  fs.writeFileSync(path.join(OUTPUT_DIR, "types.ts"), generateTypesFile());
  console.log("   ✓ types.ts");

  // components.ts
  fs.writeFileSync(path.join(OUTPUT_DIR, "components.ts"), generateComponentsFile(components));
  console.log("   ✓ components.ts");

  // addresses.ts
  fs.writeFileSync(path.join(OUTPUT_DIR, "addresses.ts"), generateAddressesFile(addresses));
  console.log("   ✓ addresses.ts");

  // index.ts
  fs.writeFileSync(path.join(OUTPUT_DIR, "index.ts"), generateIndexFile(abiFiles));
  console.log("   ✓ index.ts");

  // 9. Summary
  console.log("\n" + "=".repeat(60));
  console.log("✅ Code generation complete!\n");
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`\nGenerated:`);
  console.log(`  📄 ${components.length} emergency components`);
  console.log(`  🔗 ${Object.keys(addresses).length} chains with addresses`);
  console.log(`  📦 ${abiFiles.length} ABI files`);

  // List components
  console.log(`\nComponents:`);
  for (const comp of components) {
    console.log(`  - ${comp.name} (${comp.id}): ${comp.calls.length} calls, ${comp.chains.length} chains`);
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
