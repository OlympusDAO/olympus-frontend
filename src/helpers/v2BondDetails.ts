import { OHMTokenStackProps } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";

import { NetworkId } from "../networkDetails";
import {
  BalancerV2Pool,
  BalancerV2Pool__factory,
  BalancerVault__factory,
  CurveETHSwapPool,
  CurveETHSwapPool__factory,
  CurveFactory__factory,
  GUniV3Lp,
  GUniV3Lp__factory,
  IERC20__factory,
  UniswapV2Lp,
  UniswapV2Lp__factory,
} from "../typechain";
import { getTokenByContract, getTokenPrice } from "./";

export interface V2BondDetails {
  name: string;
  bondIconSvg: OHMTokenStackProps["tokens"];
  pricingFunction(): Promise<number> | number;
  isLP: boolean;
  lpUrl: string;
}
interface BalancerPool {
  type: "balancer";
  instance: BalancerV2Pool;
}
interface UniswapV2Pool {
  type: "uniswapV2";
  instance: UniswapV2Lp;
}
interface UniswapV3Pool {
  type: "uniswapV3";
  instance: GUniV3Lp;
}
interface CurveSwapPool {
  type: "curveSwap";
  instance: CurveETHSwapPool;
}

type SupportedPools = BalancerPool | UniswapV2Pool | UniswapV3Pool | CurveSwapPool;

const OhmDetails: V2BondDetails = {
  name: "OHM",
  bondIconSvg: ["OHM"],
  pricingFunction: async () => {
    return getTokenByContract("0x383518188c0c6d7730d91b2c03a03c837814a899");
  },
  isLP: false,
  lpUrl: "",
};

const DaiDetails: V2BondDetails = {
  name: "DAI",
  bondIconSvg: ["DAI"],
  pricingFunction: async () => {
    return getTokenPrice("dai");
  },
  isLP: false,
  lpUrl: "",
};

const sOhmDetails: V2BondDetails = {
  name: "sOHM",
  bondIconSvg: ["sOHM"],
  pricingFunction: async () => {
    return getTokenPrice("olympus");
  },
  isLP: false,
  lpUrl: "",
};

const gOhmDetails: V2BondDetails = {
  name: "gOHM",
  bondIconSvg: ["wsOHM"],
  pricingFunction: async () => {
    return getTokenByContract("0x0ab87046fbb341d058f17cbc4c1133f25a20a52f");
  },
  isLP: false,
  lpUrl: "",
};

const LusdDetails: V2BondDetails = {
  name: "LUSD",
  bondIconSvg: ["LUSD"],
  pricingFunction: async () => {
    return getTokenByContract("0x5f98805A4E8be255a32880FDeC7F6728C6568bA0");
  },
  isLP: false,
  lpUrl: "",
};

const FraxDetails: V2BondDetails = {
  name: "FRAX",
  bondIconSvg: ["FRAX"],
  pricingFunction: async () => {
    return 1.0;
  },
  isLP: false,
  lpUrl: "",
};

const EthDetails: V2BondDetails = {
  name: "ETH",
  bondIconSvg: ["wETH"],
  pricingFunction: async () => {
    return getTokenPrice("ethereum");
  },
  isLP: false,
  lpUrl: "",
};

const CvxDetails: V2BondDetails = {
  name: "CVX",
  bondIconSvg: ["CVX"],
  pricingFunction: async () => {
    return getTokenPrice("convex-finance");
  },
  isLP: false,
  lpUrl: "",
};

const FxsDetails: V2BondDetails = {
  name: "FXS",
  bondIconSvg: ["FXS"],
  pricingFunction: async () => {
    return getTokenByContract("0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0");
  },
  isLP: false,
  lpUrl: "",
};

const UstDetails: V2BondDetails = {
  name: "UST",
  bondIconSvg: ["UST"],
  pricingFunction: async () => {
    return getTokenByContract("0xa693b19d2931d498c5b318df961919bb4aee87a5");
  },
  isLP: false,
  lpUrl: "",
};

const WbtcDetails: V2BondDetails = {
  name: "wBTC",
  bondIconSvg: ["wBTC"],
  pricingFunction: async () => {
    return getTokenByContract("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599");
  },
  isLP: false,
  lpUrl: "",
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
export const singleSidedBondDetails: { [key: number]: { [key: string]: V2BondDetails } } = {
  [NetworkId.TESTNET_RINKEBY]: {
    ["0xc0b491dabf3709ee5eb79e603d73289ca6060932"]: OhmDetails,
    ["0xd7b98050962ec7cc8d11a83446b3217257c754b7"]: OhmDetails,
    // ["0x14cD61F5d13a4E175F032B252f197B65B9c8E6dc"]: OhmDetails,
    ["0xb2180448f8945c8cc8ae9809e67d6bd27d8b2f2c"]: DaiDetails,
    ["0x5ed8bd53b0c3fa3deabd345430b1a3a6a4e8bd7c"]: DaiDetails,
    ["0xbc9ee0d911739cbc72cd094ada26f56e0c49eeae"]: DaiDetails,
    ["0x2f7249cb599139e560f0c81c269ab9b04799e453"]: FraxDetails,
    ["0xc778417e063141139fce010982780140aa0cd5ab"]: EthDetails,
    // ["0xb2180448f8945c8cc8ae9809e67d6bd27d8b2f2c"]: CvxDetails, // we do not have CVX rinkeby in previous bonds
    // ["0x80edbf2f58c7b130df962bb485c28188f6b5ed29"]: OhmDaiDetails,
  },
  [NetworkId.MAINNET]: {
    ["0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5"]: OhmDetails,
    ["0x04906695d6d12cf5459975d7c3c03356e4ccd460"]: sOhmDetails,
    ["0x0ab87046fbb341d058f17cbc4c1133f25a20a52f"]: gOhmDetails,
    ["0x6b175474e89094c44da98b954eedeac495271d0f"]: DaiDetails,
    ["0x853d955acef822db058eb8505911ed77f175b99e"]: FraxDetails,
    ["0x5f98805a4e8be255a32880fdec7f6728c6568ba0"]: LusdDetails,
    ["0xa693b19d2931d498c5b318df961919bb4aee87a5"]: UstDetails,
    ["0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"]: WbtcDetails,
    ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]: EthDetails,
    ["0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b"]: CvxDetails,
    ["0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0"]: FxsDetails,
    // ["0x69b81152c5a8d35a67b32a4d3772795d96cae4da"]: OhmEthDetails,
    // ["0x055475920a8c93cffb64d039a8205f7acc7722d3"]: OhmDaiDetails,
    // ["0xfdf12d1f85b5082877a6e070524f50f6c84faa6b"]: OhmV1LusdDetails,
  },
};

/**
 * G-Uni LP will have a variable, ever-changing set of reserve addresses, so parsing code needs to be dynamic
 *
 * BondParser should figure out what to return:
 * 1. logos
 * 2. names
 * 3. pricing
 * 4. isLP
 * 5. lpURL
 */
export class V2BondParser {
  assetAddress: string;
  networkId: NetworkId;
  provider: ethers.providers.JsonRpcProvider;

  constructor(assetAddress: string, networkId: NetworkId, provider: ethers.providers.JsonRpcProvider) {
    this.assetAddress = assetAddress;
    this.networkId = networkId;
    this.provider = provider;
  }

  /**
   * normalize asset, returns either singleSided BondDetails or LP BondDetails
   * 1. first check if asset is single-sided
   * 2. check if LP & get LP details
   * 3. fallback to DAI
   */
  async details() {
    if (singleSidedBondDetails[this.networkId] && singleSidedBondDetails[this.networkId][this.assetAddress]) {
      return singleSidedBondDetails[this.networkId][this.assetAddress];
    } else {
      const lp = await this.isLP();
      if (lp) {
        return await this._lpDetails(lp);
      } else {
        // return DAI as default
        return singleSidedBondDetails[NetworkId.MAINNET]["0x6b175474e89094c44da98b954eedeac495271d0f"];
      }
    }
    return UnknownDetails;
  }

  /**
   * combine singleAssetDetails into an LP detail
   */

  /**
   * Passes in a LP Contract and returns the appropriate details
   * @param contract
   * @returns {V2BondDetails} `V2BondDetails`
   */
  async _lpDetails(contract: SupportedPools) {
    let tokens: string[];
    let reserves: BigNumber[];
    let useBondIcons: OHMTokenStackProps["tokens"];
    let name: string;
    let totalSupply: number;
    let totalValue: number;
    let poolId: string;
    let lpUrl: string;

    switch (contract.type) {
      case "balancer":
        ({
          poolTokens: { tokens, balances: reserves },
          poolId,
        } = await this._balancerTokenAddresses(contract.instance));
        ({ useBondIcons, name } = this._lpIconsAndName(tokens));
        totalSupply = await this._totalSupply(contract.instance);
        totalValue = await this._totalPoolValue(tokens, reserves);
        lpUrl = `https://app.balancer.fi/#/pool/${poolId}`;
        break;
      case "uniswapV2":
        tokens = await this._uniswapTokenAddresses(contract.instance);
        ({ useBondIcons, name } = this._lpIconsAndName(tokens));
        totalSupply = await this._totalSupply(contract.instance);
        reserves = await this._uniswapV2Reserves(contract.instance);
        totalValue = await this._totalPoolValue(tokens, reserves);
        lpUrl = await this._lpUrl(tokens[0], tokens[1], contract.instance);
        break;
      case "uniswapV3": {
        tokens = await this._uniswapTokenAddresses(contract.instance);
        ({ useBondIcons, name } = this._lpIconsAndName(tokens));
        totalSupply = await this._totalSupply(contract.instance);
        reserves = await this._uniswapV3Reserves(contract.instance);
        totalValue = await this._totalPoolValue(tokens, reserves);
        lpUrl = await this._lpUrl(tokens[0], tokens[1], contract.instance);
        break;
      }
      case "curveSwap": {
        tokens = await this._curveTokenAddresses(contract.instance);
        ({ useBondIcons, name } = this._lpIconsAndName(tokens));
        totalValue = await +contract.instance.lp_price();
        totalSupply = 1;
        lpUrl = `https://curve.fi/factory-crypto/21`;
        break;
      }
      default: {
        return UnknownDetails;
      }
    }
    const valuePerLpToken = totalValue / totalSupply;

    const result: V2BondDetails = {
      name: name,
      bondIconSvg: useBondIcons,
      pricingFunction: () => valuePerLpToken,
      isLP: true,
      lpUrl: lpUrl,
    };
    return result;
  }

  /**
   * Returns appropriate pool URLs for Pools based on Uniswap Contracts
   * @param token0
   * @param token1
   * @returns {string} `string` URL of LP
   */
  async _lpUrl(token0: string, token1: string, contract: UniswapV2Lp | GUniV3Lp) {
    const lpName = await contract.name();
    if (lpName.indexOf("Gelato") >= 0) {
      return `https://www.sorbet.finance/#/pools/${this.assetAddress}`;
    } else if (lpName.indexOf("Sushi") >= 0) {
      const url = `https://app.sushi.com/add/${token0}/${token1}`;
      return url;
    } else if (lpName.indexOf("Uniswap V2") >= 0) {
      return `https://app.uniswap.org/#/add/v2/${token0}/${token1}`;
    } else {
      return "";
    }
  }

  /**
   * isLP checks for various LP types and returns the contract  for the appropriate LP.
   */
  async isLP() {
    try {
      const uniswapV2 = await this._isUniV2Lp();
      if (uniswapV2) return uniswapV2;
      const gUniV3 = await this._isGUniV3Lp();
      if (gUniV3) return gUniV3;
      const balancerPool = await this._isBalancerLp();
      if (balancerPool) return balancerPool;
      const curveSwapPool = await this._isCurveSwapLP();
      if (curveSwapPool) return curveSwapPool;
      return false;
    } catch {
      // Something went wrong. If we got here, either contract calls failed or it's an unsupported LP.
      return false;
    }
  }

  /**
   * Checks to determine if the LP is a Uniswap V2 LP
   * @returns Contract if true, or false
   */
  async _isUniV2Lp() {
    const contract = UniswapV2Lp__factory.connect(this.assetAddress, this.provider);
    try {
      if (await contract.getReserves()) return { type: "uniswapV2" as const, instance: contract };
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Checks to determine if the LP is a Uniswap V# LP
   * @returns Contract if true, or false
   */
  async _isGUniV3Lp() {
    const contract = GUniV3Lp__factory.connect(this.assetAddress, this.provider);
    try {
      if (await contract.getUnderlyingBalances()) return { type: "uniswapV3" as const, instance: contract };
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Checks to determine if the LP is a Balancer LP
   * @returns Contract if true, or false
   */
  async _isBalancerLp() {
    const contract = BalancerV2Pool__factory.connect(this.assetAddress, this.provider);
    try {
      if (await contract.getVault()) return { type: "balancer" as const, instance: contract };
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Checks to determine if the LP is a Curve Swap LP
   * @returns Contract if true, or false
   */
  async _isCurveSwapLP() {
    const contract = CurveETHSwapPool__factory.connect(this.assetAddress, this.provider);
    try {
      if (await contract.factory()) return { type: "curveSwap" as const, instance: contract };
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Returns token addresses associated with a Uniswap V2 or V3 LP
   * @param contract
   * @returns Array of LP Tokens
   */
  async _uniswapTokenAddresses(contract: UniswapV2Lp | GUniV3Lp) {
    const token0 = await contract.token0();
    const token1 = await contract.token1();
    return [token0, token1];
  }

  /**
   * Get Uni V2 LP Reserves
   * @param contract
   * @returns Array of LP Tokens
   */
  async _uniswapV2Reserves(contract: UniswapV2Lp) {
    const reserves = await contract.getReserves();
    return [reserves._reserve0, reserves._reserve1];
  }

  /**
   * Get Uni V3 LP Reserves
   * @param contract
   * @returns Array of Reserves
   */
  async _uniswapV3Reserves(contract: GUniV3Lp) {
    const reserves = await contract.getUnderlyingBalances();
    return [reserves.amount0Current, reserves.amount1Current];
  }

  /**
   * Returns token addresses associated with a Uniswap V2 or V3 LP
   * @param contract
   * @returns Array of LP Tokens
   */
  async _balancerTokenAddresses(contract: BalancerV2Pool) {
    const vault = await contract.getVault();
    const poolId = await contract.getPoolId();
    const vaultContract = BalancerVault__factory.connect(vault, this.provider);
    const poolTokens = await vaultContract.getPoolTokens(poolId);
    return { poolTokens, poolId };
  }

  /**
   * Returns token addresses associated with a Curve LP
   * @param contract
   * @returns Array of LP Tokens
   */
  async _curveTokenAddresses(contract: CurveETHSwapPool) {
    const factoryAddress = await contract.factory();
    const factoryContract = CurveFactory__factory.connect(factoryAddress, this.provider);
    const tokens = await factoryContract.get_coins(contract.address);
    return tokens;
  }

  /**
   * Takes an array of token addresses and returns icons and LP name
   * @param {string[]} tokens - Array of token addresses
   * @returns {object} Object containing icon and LP name
   **/
  _lpIconsAndName(tokens: string[]) {
    const tokenStack = tokens.map(token => {
      const tokenName = singleSidedBondDetails[this.networkId][token.toLowerCase()];
      if (tokenName.bondIconSvg) {
        return tokenName.bondIconSvg[0];
      }
      return "OHM";
    });

    const lpName = tokens.reduce((a, b, i) => {
      if (i === 0) {
        return singleSidedBondDetails[this.networkId][b.toLowerCase()].name;
      }
      return a.concat("-", singleSidedBondDetails[this.networkId][b.toLowerCase()].name);
    }, "");

    return { useBondIcons: tokenStack, name: `${lpName} LP` };
  }

  /**
   * Iterates over token addresses, and associates reserve balances
   * to return USD value of the LP. Reserves and associated addresses must be in same array order.
   * @param tokens
   * @param reserves
   * @returns {number} totalValue
   */
  async _totalPoolValue(tokens: string[], reserves: BigNumber[]) {
    const tokenValues = await Promise.all(
      tokens.map(async (token, index) => {
        const tokenContract = IERC20__factory.connect(token, this.provider);
        const decimals = await tokenContract.decimals();
        const tokenAmount = +reserves[index] / Math.pow(10, decimals);
        const tokenValue = (await getTokenByContract(token)) * tokenAmount;
        return tokenValue;
      }),
    );
    const totalValue = tokenValues.reduce((a, b) => a + b, 0);
    return totalValue;
  }

  /**
   * TotalSupply helper. Makes Contract Call to totalSupply and returns
   * formatted value based on contract decimals.
   * @param contract
   * @returns {number} - `number` totalSupply of LP
   */
  async _totalSupply(contract: BalancerV2Pool | UniswapV2Lp | GUniV3Lp) {
    const totalSupply = +(await contract.totalSupply()) / Math.pow(10, await contract.decimals());
    return totalSupply;
  }
}
