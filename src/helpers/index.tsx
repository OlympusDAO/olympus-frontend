import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { SvgIcon } from "@material-ui/core";
import axios from "axios";
import { ethers } from "ethers";
import { IBondV2 } from "src/slices/BondSliceV2";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { GOHM__factory } from "src/typechain/factories/GOHM__factory";

import { abi as PairContractABI } from "../abi/PairContract.json";
import { abi as RedeemHelperABI } from "../abi/RedeemHelper.json";
import { ReactComponent as OhmImg } from "../assets/tokens/token_OHM.svg";
import { ReactComponent as SOhmImg } from "../assets/tokens/token_sOHM.svg";
import { addresses, BLOCK_RATE_SECONDS, EPOCH_INTERVAL, NetworkId } from "../constants";
import { PairContract, RedeemHelper } from "../typechain";
import { ohm_dai, ohm_daiOld, ohm_weth } from "./AllBonds";
import { EnvHelper } from "./Environment";
import { NodeHelper } from "./NodeHelper";

/**
 * gets marketPrice from Ohm-DAI v2
 * @returns Number like 333.33
 */
export async function getMarketPrice() {
  const mainnetProvider = NodeHelper.getMainnetStaticProvider();
  // v2 price
  const ohm_dai_address = ohm_dai.getAddressForReserve(NetworkId.MAINNET);
  const pairContract = new ethers.Contract(ohm_dai_address || "", PairContractABI, mainnetProvider) as PairContract;
  const reserves = await pairContract.getReserves();

  return Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
}

export async function getMarketPriceFromWeth() {
  const mainnetProvider = NodeHelper.getMainnetStaticProvider();
  // v2 price
  const ohm_weth_address = ohm_weth.getAddressForReserve(NetworkId.MAINNET);
  const wethBondContract = ohm_weth.getContractForBond(NetworkId.MAINNET, mainnetProvider);
  const pairContract = new ethers.Contract(ohm_weth_address || "", PairContractABI, mainnetProvider) as PairContract;
  const reserves = await pairContract.getReserves();

  // since we're using OHM/WETH... also need to multiply by weth price;
  const wethPriceBN: BigNumber = await wethBondContract.assetPrice();
  const wethPrice = Number(wethPriceBN.toString()) / Math.pow(10, 8);
  return (Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9) * wethPrice;
}

export async function getV1MarketPrice() {
  const mainnetProvider = NodeHelper.getMainnetStaticProvider();
  // v1 price
  const ohm_dai_address = ohm_daiOld.getAddressForReserve(NetworkId.MAINNET);
  const pairContract = new ethers.Contract(ohm_dai_address || "", PairContractABI, mainnetProvider) as PairContract;
  const reserves = await pairContract.getReserves();
  return Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
}

/**
 * gets price of token from coingecko
 * @param tokenId STRING taken from https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
 * @returns INTEGER usd value
 */
export async function getTokenPrice(tokenId = "olympus"): Promise<number> {
  try {
    const resp = (await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
    )) as {
      data: { [id: string]: { usd: number } };
    };
    const tokenPrice: number = resp.data[tokenId].usd;
    return tokenPrice;
  } catch (e) {
    // console.log("coingecko api error: ", e);
    return 0;
  }
}

/**
 * gets price of token from coingecko
 * @param contractAddress STRING representing address
 * @returns INTEGER usd value
 */
export async function getTokenByContract(contractAddress: string): Promise<number> {
  const downcasedAddress = contractAddress.toLowerCase();
  const chainName = "ethereum";
  try {
    const resp = (await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/${chainName}?contract_addresses=${downcasedAddress}&vs_currencies=usd`,
    )) as {
      data: { [address: string]: { usd: number } };
    };
    const tokenPrice: number = resp.data[downcasedAddress].usd;
    return tokenPrice;
  } catch (e) {
    // console.log("coingecko api error: ", e);
    return 0;
  }
}

export async function getTokenIdByContract(contractAddress: string): Promise<string> {
  try {
    const resp = (await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}'`)) as {
      data: { id: string };
    };
    return resp.data.id;
  } catch (e) {
    // console.log("coingecko api error: ", e);
    return "";
  }
}

export const getEtherscanUrl = ({ bond, networkId }: { bond: IBondV2; networkId: NetworkId }) => {
  if (networkId === NetworkId.TESTNET_RINKEBY) {
    return `https://rinkeby.etherscan.io/address/${bond.quoteToken}`;
  }
  return `https://etherscan.io/address/${bond.quoteToken}`;
};

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shortenString(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function formatCurrency(c: number, precision = 0, currency = "USD") {
  if (currency === "OHM") return `${trim(c, precision)} Ω`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
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

export function getRebaseBlock(currentBlock: number) {
  return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
}

export function secondsUntilBlock(startBlock: number, endBlock: number): number {
  const blocksAway = endBlock - startBlock;
  const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

  return secondsAway;
}

export function prettyVestingPeriod(currentBlock: number, vestingBlock: number) {
  if (vestingBlock === 0) {
    return "";
  }

  const seconds = secondsUntilBlock(currentBlock, vestingBlock);
  if (seconds < 0) {
    return "Fully Vested";
  }
  return prettifySeconds(seconds);
}

export function prettifySeconds(seconds: number, resolution?: string) {
  if (seconds !== 0 && !seconds) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days");
  }

  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";

  let result = dDisplay + hDisplay + mDisplay;
  if (mDisplay === "") {
    result = result.slice(0, result.length - 2);
  }

  return result;
}

function getSohmTokenImage() {
  return <SvgIcon component={SOhmImg} viewBox="0 0 100 100" style={{ height: "1rem", width: "1rem" }} />;
}

export function getOhmTokenImage(w?: number, h?: number) {
  const height = h == null ? "32px" : `${h}px`;
  const width = w == null ? "32px" : `${w}px`;
  return <SvgIcon component={OhmImg} viewBox="0 0 32 32" style={{ height, width }} />;
}

export function getTokenImage(name: string) {
  if (name === "ohm") return getOhmTokenImage();
  if (name === "sohm") return getSohmTokenImage();
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

export function contractForRedeemHelper({
  networkID,
  provider,
}: {
  networkID: NetworkId;
  provider: StaticJsonRpcProvider | JsonRpcSigner;
}) {
  return new ethers.Contract(
    addresses[networkID].REDEEM_HELPER_ADDRESS as string,
    RedeemHelperABI,
    provider,
  ) as RedeemHelper;
}

/**
 * returns false if SafetyCheck has fired in this Session. True otherwise
 * @returns boolean
 */
export const shouldTriggerSafetyCheck = () => {
  const _storage = window.sessionStorage;
  const _safetyCheckKey = "-oly-safety";
  // check if sessionStorage item exists for SafetyCheck
  if (!_storage.getItem(_safetyCheckKey)) {
    _storage.setItem(_safetyCheckKey, "true");
    return true;
  }
  return false;
};

/**
 * returns unix timestamp for x minutes ago
 * @param x minutes as a number
 */
export const minutesAgo = (x: number) => {
  const now = new Date().getTime();
  return new Date(now - x * 60000).getTime();
};

/**
 * subtracts two dates for use in 33-together timer
 * param (Date) dateA is the ending date object
 * param (Date) dateB is the current date object
 * returns days, hours, minutes, seconds
 * NOTE: this func previously used parseInt() to convert to whole numbers, however, typescript doesn't like
 * ... using parseInt on number params. It only allows parseInt on string params. So we converted usage to
 * ... Math.trunc which accomplishes the same result as parseInt.
 */
export const subtractDates = (dateA: Date, dateB: Date) => {
  const msA: number = dateA.getTime();
  const msB: number = dateB.getTime();

  let diff: number = msA - msB;

  let days = 0;
  if (diff >= 86400000) {
    days = Math.trunc(diff / 86400000);
    diff -= days * 86400000;
  }

  let hours = 0;
  if (days || diff >= 3600000) {
    hours = Math.trunc(diff / 3600000);
    diff -= hours * 3600000;
  }

  let minutes = 0;
  if (hours || diff >= 60000) {
    minutes = Math.trunc(diff / 60000);
    diff -= minutes * 60000;
  }

  let seconds = 0;
  if (minutes || diff >= 1000) {
    seconds = Math.trunc(diff / 1000);
  }
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const toBN = (num: number) => {
  return BigNumber.from(num);
};

export const bnToNum = (bigNum: BigNumber) => {
  return Number(bigNum.toString());
};

export const handleContractError = (e: any) => {
  if (EnvHelper.env.NODE_ENV !== "production") console.warn("caught error in slices; usually network related", e);
};

/**
 * Determines if app is viewed within an <iframe></iframe>
 */
export const isIFrame = () => window.location !== window.parent.location;

/**
 * Assertion function helpful for asserting `enabled`
 * values from within a `react-query` function.
 * @param value The value(s) to assert
 * @param queryKey Key of current query
 */
export function queryAssertion(value: unknown, queryKey: any = "not specified"): asserts value {
  if (!value) throw new Error(`Failed react-query assertion for key: ${queryKey}`);
}

/**
 * Assertion function
 */
export function assert(value: unknown, message: string | Error): asserts value {
  if (!value) throw message instanceof Error ? message : new Error(message);
}

/**
 * Converts gOHM to OHM. Mimics `balanceFrom()` gOHM contract function.
 * @returns Formatted string representation of OHM equivalent.
 */
export const convertGohmToOhm = (amount: BigNumber, index: BigNumber): string => {
  return formatUnits(amount.div(10 ** 9).mul(index), 36);
};

/**
 * Converts OHM to gOHM. Mimics `balanceTo()` gOHM contract function.
 * @returns Formatted string representation of gOHM equivalent.
 */
export const convertOhmToGohm = (amount: BigNumber, index: BigNumber): string => {
  return formatUnits(amount.mul(10 ** 9).div(index), 18);
};

export const parseBigNumber = (value: BigNumber, units: BigNumberish = 9) => {
  return parseFloat(formatUnits(value, units));
};

interface ICheckBalance extends IBaseAsyncThunk {
  readonly sOHMbalance: string;
}

export const getGohmBalFromSohm = async ({ provider, networkID, sOHMbalance }: ICheckBalance) => {
  const gOhmContract = GOHM__factory.connect(addresses[networkID].GOHM_ADDRESS, provider);
  const formattedGohmBal = await gOhmContract.balanceTo(ethers.utils.parseUnits(sOHMbalance, "gwei").toString());
  return ethers.utils.formatEther(formattedGohmBal);
};
