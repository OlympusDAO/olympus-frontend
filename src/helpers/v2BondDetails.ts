import { OHMTokenStackProps } from "@olympusdao/component-library";
import { ethers } from "ethers";

import { NetworkId } from "../networkDetails";
import { GUniV3Lp__factory, IERC20__factory, UniswapV2Lp, UniswapV2Lp__factory } from "../typechain";
import { getTokenByContract, getTokenPrice } from "./";

// const pricingFunctionHelper = async (provider: ethers.providers.JsonRpcProvider, quoteToken: string) => {
//   const baseContract = UniswapV2Lp__factory.connect(quoteToken, provider);
//   // need
//   const reserves = await baseContract.getReserves();
//   const totalSupply = +(await baseContract.totalSupply()) / Math.pow(10, await baseContract.decimals());

//   const token0Address = await baseContract.token0();
//   const token0Contract = IERC20__factory.connect(token0Address, provider);
//   const token0Decimals = await token0Contract.decimals();
//   const token0Amount = +reserves._reserve0 / Math.pow(10, token0Decimals);
//   const token0TotalValue = (await getTokenByContract(token0Address)) * token0Amount;

//   const token1Address = await baseContract.token1();
//   const token1Contract = IERC20__factory.connect(token1Address, provider);
//   const token1Decimals = await token1Contract.decimals();
//   const token1Amount = +reserves._reserve1 / Math.pow(10, token1Decimals);
//   const token1TotalValue = (await getTokenByContract(token1Address)) * token1Amount;

//   const totalValue = token0TotalValue + token1TotalValue;
//   const valuePerLpToken = totalValue / totalSupply;

//   return valuePerLpToken;
// };

export interface V2BondDetails {
  name: string;
  bondIconSvg: OHMTokenStackProps["tokens"];
  pricingFunction(): Promise<number>;
  isLP: boolean;
  lpUrl: string;
}

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

// const OhmDaiDetails: V2BondDetails = {
//   name: "OHM-DAI LP",
//   bondIconSvg: ["OHM", "DAI"],
//   async pricingFunction(provider, quoteToken) {
//     return pricingFunctionHelper(provider, quoteToken);
//   },
//   isLP: true,
//   lpUrl: {
//     [NetworkId.TESTNET_RINKEBY]:
//       "https://app.sushi.com/add/0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C/0x1e630a578967968eb02EF182a50931307efDa7CF",
//     [NetworkId.MAINNET]:
//       "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x6b175474e89094c44da98b954eedeac495271d0f",
//   },
// };

// const OhmV1LusdDetails: V2BondDetails = {
//   name: "OHMv1-LUSD LP",
//   bondIconSvg: ["OHM", "LUSD"],
//   async pricingFunction(provider, quoteToken) {
//     return pricingFunctionHelper(provider, quoteToken);
//   },
//   isLP: true,
//   lpUrl: {
//     [NetworkId.TESTNET_RINKEBY]: "",
//     [NetworkId.MAINNET]:
//       "https://app.sushi.com/add/0x383518188C0C6d7730D91b2c03a03C837814a899/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
//   },
// };

// const OhmEthDetails: V2BondDetails = {
//   name: "OHM-ETH LP",
//   bondIconSvg: ["OHM", "wETH"],
//   async pricingFunction(provider, quoteToken) {
//     return pricingFunctionHelper(provider, quoteToken);
//   },
//   isLP: true,
//   lpUrl: {
//     [NetworkId.MAINNET]:
//       "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
//   },
// };

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
  baseContract: UniswapV2Lp;
  provider: ethers.providers.JsonRpcProvider;

  constructor(assetAddress: string, networkId: NetworkId, provider: ethers.providers.JsonRpcProvider) {
    this.assetAddress = assetAddress;
    this.networkId = networkId;
    this.provider = provider;
    this.baseContract = UniswapV2Lp__factory.connect(this.assetAddress, this.provider);
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
    } else if (await this.isLP()) {
      console.log("in isLP if");
      return this._lpDetails();
    } else {
      // return DAI as default
      return singleSidedBondDetails[NetworkId.MAINNET]["0x6b175474e89094c44da98b954eedeac495271d0f"];
    }
    return UnknownDetails;
  }

  /**
   * combine singleAssetDetails into an LP detail
   */
  async _lpDetails() {
    const token0 = await this.baseContract.token0();
    const token1 = await this.baseContract.token1();

    if (!token0 || !token1) {
      return UnknownDetails;
    }
    console.log("tokens", token0.toLowerCase(), token1.toLowerCase());
    const token0Details: V2BondDetails = singleSidedBondDetails[this.networkId][token0.toLowerCase()];
    const token1Details: V2BondDetails = singleSidedBondDetails[this.networkId][token1.toLowerCase()];
    console.log("tokens", token0Details, token1Details);
    const name = token0Details.name.concat("-", token1Details.name, " LP");

    let useBondIcons = UnknownDetails.bondIconSvg;
    if (token0Details.bondIconSvg && token1Details.bondIconSvg) {
      const token0Icon = token0Details.bondIconSvg[0];
      const token1Icon = token1Details.bondIconSvg[0];
      useBondIcons = [token0Icon, token1Icon];
    }

    const result: V2BondDetails = {
      name: name,
      bondIconSvg: useBondIcons,
      pricingFunction: async () => {
        return this._lpPricingHelper();
      },
      isLP: true,
      lpUrl: await this._lpUrl(token0, token1),
    };
    return result;
  }

  /**
   * prices SLP, Uni V2 LP && G-Uni V3 LP
   * @returns number for `valuePerLpToken`
   */
  async _lpPricingHelper() {
    const totalSupply = +(await this.baseContract.totalSupply()) / Math.pow(10, await this.baseContract.decimals());

    const token0Address = await this.baseContract.token0();
    const token0Contract = IERC20__factory.connect(token0Address, this.provider);
    const token0Decimals = await token0Contract.decimals();

    const token1Address = await this.baseContract.token1();
    const token1Contract = IERC20__factory.connect(token1Address, this.provider);
    const token1Decimals = await token1Contract.decimals();

    let token0Amount: number;
    let token1Amount: number;
    try {
      // `getReserves` on Uni V2 & SLP
      const reserves = await this.baseContract.getReserves();
      token0Amount = +reserves._reserve0 / Math.pow(10, token0Decimals);
      token1Amount = +reserves._reserve1 / Math.pow(10, token1Decimals);
    } catch {
      // we assume this is g-uni lp since `getReserves` does not exist
      const reserves = await GUniV3Lp__factory.connect(this.assetAddress, this.provider).getUnderlyingBalances();
      token0Amount = +reserves.amount0Current / Math.pow(10, token0Decimals);
      token1Amount = +reserves.amount1Current / Math.pow(10, token1Decimals);
    }

    const token0TotalValue = (await getTokenByContract(token0Address)) * token0Amount;
    const token1TotalValue = (await getTokenByContract(token1Address)) * token1Amount;

    const totalValue = token0TotalValue + token1TotalValue;
    const valuePerLpToken = totalValue / totalSupply;

    return valuePerLpToken;
  }

  async _getAssetPrice(tokenAddress: string) {
    if (this.networkId === NetworkId.MAINNET) {
      return await getTokenByContract(tokenAddress);
    } else {
      return await singleSidedBondDetails[this.networkId][tokenAddress].pricingFunction();
    }
  }

  async _lpUrl(token0: string, token1: string) {
    const lpName = await this.baseContract.name();
    console.log("lpName", lpName.indexOf("Sushi"));
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
   * isLP is true if `token0()` is a function on the contract
   */
  async isLP() {
    try {
      await this.baseContract.token0();
      return true;
    } catch {
      // we are assuming it's LP because token0 does not exist...
      return false;
    }
  }

  async _isUniV2Lp() {
    try {
      await this.baseContract.getReserves();
      return true;
    } catch {
      // we are assuming it's G-UNI LP because getReserves does not exist...
      return false;
    }
  }
}
