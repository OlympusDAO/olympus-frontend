import { OHMTokenStackProps } from "@olympusdao/component-library";
import { ethers } from "ethers";

import arbitrum from "./assets/arbitrum.png";
import avalanche from "./assets/tokens/AVAX.svg";
import polygon from "./assets/tokens/matic.svg";
import ethereum from "./assets/tokens/wETH.svg";
import { NetworkId } from "./baseTypes";
import { getTokenByContract, getTokenPrice } from "./helpers";
import { EnvHelper } from "./helpers/Environment";
import { NodeHelper } from "./helpers/NodeHelper";
import { IERC20__factory, UniswapV2Lp__factory } from "./typechain";
export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-protocol-metrics";
export const EPOCH_INTERVAL = 2200;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 13.14;

export const TOKEN_DECIMALS = 9;

interface IPoolGraphURLS {
  [index: string]: string;
}

export const POOL_GRAPH_URLS: IPoolGraphURLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

/**
 * Network details required to add a network to a user's wallet, as defined in EIP-3085 (https://eips.ethereum.org/EIPS/eip-3085)
 */

interface INativeCurrency {
  name: string;
  symbol: string;
  decimals?: number;
}

interface INetwork {
  chainName: string;
  chainId: number;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  image: SVGImageElement;
  imageAltText: string;
  uri: () => string;
}

// These networks will be available for users to select. Other networks may be functional
// (e.g. testnets, or mainnets being prepared for launch) but need to be selected directly via the wallet.
export const USER_SELECTABLE_NETWORKS = [NetworkId.MAINNET, NetworkId.ARBITRUM, NetworkId.AVALANCHE];

// Set this to the chain number of the most recently added network in order to enable the 'Now supporting X network'
// message in the UI. Set to -1 if we don't want to display the message at the current time.
export const NEWEST_NETWORK_ID = NetworkId.AVALANCHE;

export const NETWORKS: { [key: number]: INetwork } = {
  [NetworkId.MAINNET]: {
    chainName: "Ethereum",
    chainId: 1,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.MAINNET),
  },
  [NetworkId.TESTNET_RINKEBY]: {
    chainName: "Rinkeby Testnet",
    chainId: 4,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.TESTNET_RINKEBY),
  },
  [NetworkId.ARBITRUM]: {
    chainName: "Arbitrum",
    chainId: 42161,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.ARBITRUM),
  },
  [NetworkId.ARBITRUM_TESTNET]: {
    chainName: "Arbitrum Testnet",
    chainId: 421611,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => EnvHelper.alchemyArbitrumTestnetURI,
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    chainName: "Avalanche Fuji Testnet",
    chainId: 43113,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/#/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => EnvHelper.alchemyAvalancheTestnetURI,
  },
  [NetworkId.AVALANCHE]: {
    chainName: "Avalanche",
    chainId: 43114,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.AVALANCHE),
  },
  [NetworkId.POLYGON]: {
    chainName: "Polygon",
    chainId: 137,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    image: polygon,
    imageAltText: "Polygon Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.POLYGON),
  },
  [NetworkId.POLYGON_TESTNET]: {
    chainName: "Polygon Mumbai Testnet",
    chainId: 80001,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    image: polygon,
    imageAltText: "Polygon Logo",
    uri: () => "", // NodeHelper.getMainnetURI(NetworkId.POLYGON_TESTNET),
  },
};

// VIEWS FOR NETWORK is used to denote which paths should be viewable on each network
// ... attempting to prevent contract calls that can't complete & prevent user's from getting
// ... stuck on the wrong view
interface IViewsForNetwork {
  dashboard: boolean;
  stake: boolean;
  wrap: boolean;
  zap: boolean;
  threeTogether: boolean;
  bonds: boolean;
  network: boolean;
  bondsV2: boolean;
}

export const VIEWS_FOR_NETWORK: { [key: number]: IViewsForNetwork } = {
  [NetworkId.MAINNET]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
    bondsV2: true,
  },
  [NetworkId.TESTNET_RINKEBY]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
    bondsV2: true,
  },
  [NetworkId.ARBITRUM]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.ARBITRUM_TESTNET]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.AVALANCHE]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
    bondsV2: false,
  },
};

// VIEWS FOR NETWORK is used to denote which paths should be viewable on each network
// ... attempting to prevent contract calls that can't complete & prevent user's from getting
// ... stuck on the wrong view
export interface V2BondDetails {
  name: string;
  bondIconSvg: OHMTokenStackProps["tokens"];
  pricingFunction(provider: ethers.providers.JsonRpcProvider, quoteToken: string): Promise<number>;
  isLP: boolean;
  lpUrl: { [key: number]: string };
}

const DaiDetails: V2BondDetails = {
  name: "DAI",
  bondIconSvg: ["DAI"],
  pricingFunction: async () => {
    return getTokenPrice("dai");
  },
  isLP: false,
  lpUrl: {},
};

const FraxDetails: V2BondDetails = {
  name: "FRAX",
  bondIconSvg: ["FRAX"],
  pricingFunction: async () => {
    return 1.0;
  },
  isLP: false,
  lpUrl: {},
};

const EthDetails: V2BondDetails = {
  name: "ETH",
  bondIconSvg: ["wETH"],
  pricingFunction: async () => {
    return getTokenPrice("ethereum");
  },
  isLP: false,
  lpUrl: {},
};

const CvxDetails: V2BondDetails = {
  name: "CVX",
  bondIconSvg: ["CVX"],
  pricingFunction: async () => {
    return getTokenPrice("convex-finance");
  },
  isLP: false,
  lpUrl: {},
};

const UstDetails: V2BondDetails = {
  name: "UST",
  bondIconSvg: ["UST"],
  pricingFunction: async () => {
    return getTokenByContract("0xa693b19d2931d498c5b318df961919bb4aee87a5");
  },
  isLP: false,
  lpUrl: {},
};

const WbtcDetails: V2BondDetails = {
  name: "wBTC",
  bondIconSvg: ["wBTC"],
  pricingFunction: async () => {
    return getTokenByContract("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599");
  },
  isLP: false,
  lpUrl: {},
};

const OhmDaiDetails: V2BondDetails = {
  name: "OHM-DAI LP",
  bondIconSvg: ["OHM", "DAI"],
  async pricingFunction(provider, quoteToken) {
    return pricingFunctionHelper(provider, quoteToken, "olympus", "dai");
  },
  isLP: true,
  lpUrl: {
    [NetworkId.TESTNET_RINKEBY]:
      "https://app.sushi.com/add/0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C/0x1e630a578967968eb02EF182a50931307efDa7CF",
    [NetworkId.MAINNET]:
      "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x6b175474e89094c44da98b954eedeac495271d0f",
  },
};

const OhmEthDetails: V2BondDetails = {
  name: "OHM-ETH LP",
  bondIconSvg: ["OHM", "wETH"],
  async pricingFunction(provider, quoteToken) {
    return pricingFunctionHelper(provider, quoteToken, "olympus", "ethereum");
  },
  isLP: true,
  lpUrl: {
    [NetworkId.MAINNET]:
      "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
};

const pricingFunctionHelper = async (
  provider: ethers.providers.JsonRpcProvider,
  quoteToken: string,
  firstToken: string,
  secondToken: string,
) => {
  const baseContract = UniswapV2Lp__factory.connect(quoteToken, provider);
  const reserves = await baseContract.getReserves();
  const totalSupply = +(await baseContract.totalSupply()) / Math.pow(10, await baseContract.decimals());

  const token0Contract = IERC20__factory.connect(await baseContract.token0(), provider);
  const token0Decimals = await token0Contract.decimals();
  const token0Amount = +reserves._reserve0 / Math.pow(10, token0Decimals);
  const token0TotalValue = (await getTokenPrice(firstToken)) * token0Amount;

  const token1Contract = IERC20__factory.connect(await baseContract.token1(), provider);
  const token1Decimals = await token1Contract.decimals();
  const token1Amount = +reserves._reserve1 / Math.pow(10, token1Decimals);
  const token1TotalValue = (await getTokenPrice(secondToken)) * token1Amount;

  const totalValue = token0TotalValue + token1TotalValue;
  const valuePerLpToken = totalValue / totalSupply;

  return valuePerLpToken;
};

export const UnknownDetails: V2BondDetails = {
  name: "unknown",
  bondIconSvg: ["OHM"],
  pricingFunction: async () => {
    return 1;
  },
  isLP: false,
  lpUrl: "",
};

/**
 * DOWNCASE ALL THE ADDRESSES!!! for comparison purposes
 */
export const v2BondDetails: { [key: number]: { [key: string]: V2BondDetails } } = {
  [NetworkId.TESTNET_RINKEBY]: {
    ["0xb2180448f8945c8cc8ae9809e67d6bd27d8b2f2c"]: DaiDetails,
    ["0x5ed8bd53b0c3fa3deabd345430b1a3a6a4e8bd7c"]: DaiDetails,
    ["0x2f7249cb599139e560f0c81c269ab9b04799e453"]: FraxDetails,
    ["0xc778417e063141139fce010982780140aa0cd5ab"]: EthDetails,
    // ["0xb2180448f8945c8cc8ae9809e67d6bd27d8b2f2c"]: CvxDetails, // we do not have CVX rinkeby in previous bonds
    ["0x80edbf2f58c7b130df962bb485c28188f6b5ed29"]: OhmDaiDetails,
  },
  [NetworkId.MAINNET]: {
    ["0x6b175474e89094c44da98b954eedeac495271d0f"]: DaiDetails,
    ["0x853d955acef822db058eb8505911ed77f175b99e"]: FraxDetails,
    ["0xa693b19d2931d498c5b318df961919bb4aee87a5"]: UstDetails,
    ["0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"]: WbtcDetails,
    ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]: EthDetails,
    ["0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b"]: CvxDetails,
    ["0x69b81152c5a8d35a67b32a4d3772795d96cae4da"]: OhmEthDetails,
    ["0x055475920a8c93cffb64d039a8205f7acc7722d3"]: OhmDaiDetails,
  },
};

export * from "./baseTypes";
