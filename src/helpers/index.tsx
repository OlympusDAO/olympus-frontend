import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { SvgIcon } from "@material-ui/core";
import axios from "axios";
import { ethers } from "ethers";

import { abi as PairContractABI } from "../abi/PairContract.json";
import { abi as RedeemHelperABI } from "../abi/RedeemHelper.json";
import { ReactComponent as OhmImg } from "../assets/tokens/token_OHM.svg";
import { ReactComponent as SOhmImg } from "../assets/tokens/token_sOHM.svg";
import { addresses, EPOCH_INTERVAL, NetworkId } from "../constants";
import { PairContract, RedeemHelper } from "../typechain";
import { ohm_dai, ohm_daiOld, ohm_weth } from "./AllBonds";
import { Environment } from "./environment/Environment/Environment";
import { Providers } from "./providers/Providers/Providers";

/**
 * gets marketPrice from Ohm-DAI v2
 * @returns Number like 333.33
 */
export async function getMarketPrice() {
  const mainnetProvider = Providers.getStaticProvider(NetworkId.MAINNET);
  // v2 price
  const ohm_dai_address = ohm_dai.getAddressForReserve(NetworkId.MAINNET);
  const pairContract = new ethers.Contract(ohm_dai_address || "", PairContractABI, mainnetProvider) as PairContract;
  const reserves = await pairContract.getReserves();

  return Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
}

export async function getMarketPriceFromWeth() {
  const mainnetProvider = Providers.getStaticProvider(NetworkId.MAINNET);
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
  const mainnetProvider = Providers.getStaticProvider(NetworkId.MAINNET);
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
  let tokenPrice = 0;
  const priceApiURL = "https://api.olympusdao.finance/api/rest/coingecko_name";
  try {
    const ohmResp = (await axios.get(`${priceApiURL}/${tokenId}`)) as {
      data: { coingeckoTicker: { value: number } };
    };
    tokenPrice = ohmResp.data.coingeckoTicker.value;
  } catch (e) {
    console.warn(`Error accessing OHM API ${priceApiURL} . Falling back to coingecko API`);
    // fallback to coingecko
    const cgResp = (await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
    )) as {
      data: { [id: string]: { usd: number } };
    };
    tokenPrice = cgResp.data[tokenId].usd;
  } finally {
    // console.info(`Token price from coingecko: ${tokenPrice}`);
    return tokenPrice;
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

export const getEtherscanUrl = ({ tokenAddress, networkId }: { tokenAddress: string; networkId: NetworkId }) => {
  if (networkId === NetworkId.TESTNET_RINKEBY) {
    return `https://rinkeby.etherscan.io/address/${tokenAddress}`;
  }
  return `https://etherscan.io/address/${tokenAddress}`;
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

export const toBN = (num: number) => {
  return BigNumber.from(num);
};

export const bnToNum = (bigNum: BigNumber) => {
  return Number(bigNum.toString());
};

export const handleContractError = (e: any) => {
  if (Environment.env.NODE_ENV !== "production") console.warn("caught error in slices; usually network related", e);
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
    NetworkId.AVALANCHE_TESTNET,
    NetworkId.FANTOM_TESTNET,
    NetworkId.POLYGON_TESTNET,
    NetworkId.TESTNET_RINKEBY,
  ];

  return testnets.includes(networkId);
};
