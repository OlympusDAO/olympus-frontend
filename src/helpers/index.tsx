import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import axios from "axios";
import { NetworkId } from "src/constants";
import { OHM_DAI_LP_TOKEN } from "src/constants/tokens";
import { Environment } from "src/helpers/environment/Environment/Environment";

/**
 * gets marketPrice from Ohm-DAI v2
 * @returns Number like 333.33
 */
export async function getMarketPrice() {
  const contract = OHM_DAI_LP_TOKEN.getEthersContract(NetworkId.MAINNET);
  const reserves = await contract.getReserves();

  return Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
}

/**
 * gets price of token from coingecko
 * @param tokenId STRING taken from https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
 * @returns INTEGER usd value
 */
export async function getTokenPrice(tokenId = "olympus"): Promise<number> {
  let tokenPrice = 0;
  try {
    const cgResp = (await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
    )) as {
      data: { [id: string]: { usd: number } };
    };
    tokenPrice = cgResp.data[tokenId].usd;
  } catch (e) {
    console.warn(`Error accessing coinGecko API for ${tokenId}`);
  }
  return tokenPrice;
}

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function formatCurrency(c: number, precision = 0, currency = "USD") {
  const formatted = new Intl.NumberFormat("en-US", {
    style: currency === "USD" ? "currency" : undefined,
    currency,
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
  if (currency === "OHM") return `${formatted} Ω`;
  if (currency === "DAI") return `${formatted} DAI`;
  return formatted;
}

export function trim(number = 0, precision = 0) {
  // why would number ever be undefined??? what are we trimming?
  const array = Number(number).toFixed(8).split(".");
  if (array.length === 1) return number.toString();
  if (precision === 0) return array[0].toString();

  const poppedNumber = array.pop() || "0";
  array.push(poppedNumber.substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}

// TS-REFACTOR-NOTE - Used for:
// AccountSlice.ts, AppSlice.ts
export function setAll(state: any, properties: any) {
  if (properties) {
    const props = Object.keys(properties);
    props.forEach(key => {
      state[key] = properties[key];
    });
  }
}

/**
 * returns false if SafetyCheck has fired in this Session. True otherwise
 * @returns boolean
 */
export function shouldTriggerSafetyCheck() {
  const _storage = window.sessionStorage;
  const _safetyCheckKey = "-oly-safety";
  // check if sessionStorage item exists for SafetyCheck
  if (!_storage.getItem(_safetyCheckKey)) {
    _storage.setItem(_safetyCheckKey, "true");
    return true;
  }
  return false;
}

export const handleContractError = (e: any) => {
  if (Environment.env.MODE !== "production") console.warn("caught error in slices; usually network related", e);
};

/**
 * Determines if app is viewed within an <iframe></iframe>
 */
export const isIFrame = () => window.location !== window.parent.location;

/**
 * Converts a BigNumber to a number
 */
export const parseBigNumber = (value: BigNumber, units: BigNumberish = 9) => {
  return parseFloat(formatUnits(value, units));
};

/**
 * Formats a number to a specified amount of decimals
 */
export const formatNumber = (number: number, precision = 0) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(number);
};

export const isTestnet = (networkId: NetworkId) => {
  const testnets = [
    NetworkId.ARBITRUM_TESTNET,
    NetworkId.ARBITRUM_GOERLI,
    NetworkId.AVALANCHE_TESTNET,
    NetworkId.FANTOM_TESTNET,
    NetworkId.POLYGON_TESTNET,
    NetworkId.TESTNET_GOERLI,
  ];

  return testnets.includes(networkId);
};

export const isChainEthereum = ({
  chainId,
  includeTestnets,
}: {
  chainId: number;
  includeTestnets: boolean;
}): boolean => {
  if (!includeTestnets) return chainId === NetworkId.MAINNET;

  return chainId === NetworkId.MAINNET || chainId === NetworkId.TESTNET_GOERLI;
};

//maps known testnet contracts to mainnet for testing liquidity vaults
export const testnetToMainnetContract = (address: string) => {
  switch (address.toLowerCase()) {
    //AURA
    case "0x4a92f7C880f14c2a06FfCf56C7849739B0E492f5".toLowerCase():
      return "0xc0c293ce456ff0ed870add98a0828dd4d2903dbf";
    //LDO
    case "0x7A2D6a40f2FcF8D45669F31F51791D3B348165aa".toLowerCase():
      return "0x5a98fcbea516cf06857215779fd812ca3bef1b32";
    //wstETH
    case "0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f".toLowerCase():
      return "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0";
    //BAL
    case "0xd517A8E45771a40B29eCDa347634bD62051F91B9".toLowerCase():
      return "0xba100000625a3754423978a60c9317c58a424e3d";
    //LUSD
    case "0x004136391B304492bE9A1cD7cBc01272159Bf6Ac".toLowerCase():
      return "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0";
    default:
      return address;
  }
};

export const formatNumberOrLoading = (value: number | null | undefined, decimals = 0): string => {
  return value ? formatNumber(value, decimals) : "Loading...";
};

export const formatCurrencyOrLoading = (value: number | null | undefined, decimals = 0): string => {
  return value ? formatCurrency(value, decimals) : "Loading...";
};
