import { LPToken } from "src/helpers/contracts/LPToken";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { NetworkId } from "src/networkDetails";
import { IERC20__factory, PairContract__factory } from "src/typechain";

import {
  DAI_ADDRESSES,
  FRAX_ADDRESSES,
  GOHM_ADDRESSES,
  LUSD_ADDRESSES,
  OHM_ADDRESSES,
  OHM_DAI_LP_ADDRESSES,
  OHM_LUSD_LP_ADDRESSES,
  OHM_WETH_LP_ADDRESSES,
  SOHM_ADDRESSES,
  UST_ADDRESSES,
  V1_OHM_ADDRESSES,
  V1_SOHM_ADDRESSES,
  WBTC_ADDRESSES,
  WETH_ADDRESSES,
  WSOHM_ADDRESSES,
} from "./addresses";

export const OHM_TOKEN = new Token({
  icons: ["OHM"],
  name: "OHM",
  decimals: 9,
  addresses: OHM_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl:
    "https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
});

/**
 * We have to add the custom pricing func after
 * the token has been initialised to prevent
 * circular references during initialisation.
 */
OHM_TOKEN.customPricingFunc = async () => {
  const contract = OHM_DAI_LP_TOKEN.getEthersContract(NetworkId.MAINNET);
  const [ohm, dai] = await contract.getReserves();
  return new DecimalBigNumber(dai.div(ohm), 9);
};

export const SOHM_TOKEN = new Token({
  icons: ["sOHM"],
  name: "sOHM",
  decimals: 9,
  addresses: SOHM_ADDRESSES,
  factory: IERC20__factory,
  customPricingFunc: OHM_TOKEN.getPrice,
  purchaseUrl:
    "https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
});

export const GOHM_TOKEN = new Token({
  icons: ["gOHM"],
  name: "gOHM",
  decimals: 18,
  addresses: GOHM_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const V1_OHM_TOKEN = new Token({
  icons: ["OHM"],
  name: "OHM (v1)",
  decimals: 9,
  addresses: V1_OHM_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const V1_SOHM_TOKEN = new Token({
  icons: ["sOHM"],
  name: "sOHM (v1)",
  decimals: 9,
  addresses: V1_SOHM_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const WSOHM_TOKEN = new Token({
  icons: ["wsOHM"],
  name: "wsOHM",
  decimals: 18,
  addresses: WSOHM_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const WETH_TOKEN = new Token({
  icons: ["wETH"],
  name: "WETH",
  decimals: 18,
  addresses: WETH_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const DAI_TOKEN = new Token({
  icons: ["DAI"],
  name: "DAI",
  decimals: 18,
  addresses: DAI_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

/**
 * For inverse bonds, we have to use a different DAI testnet token
 * for compatability. Reason why has something to do with how the
 * treasury was set up on the rinkeby contract.
 */
export const TEST_DAI_TOKEN = new Token({
  icons: ["DAI"],
  name: "DAI",
  decimals: 18,
  addresses: {
    [NetworkId.MAINNET]: DAI_ADDRESSES[NetworkId.MAINNET],
    [NetworkId.TESTNET_RINKEBY]: "0xbc9ee0d911739cbc72cd094ada26f56e0c49eeae",
  },
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const LUSD_TOKEN = new Token({
  icons: ["LUSD"],
  name: "LUSD",
  decimals: 18,
  addresses: LUSD_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const OHM_WETH_LP_TOKEN = new LPToken({
  decimals: 18,
  name: "OHM-WETH LP",
  icons: ["OHM", "wETH"],
  factory: PairContract__factory,
  tokens: [OHM_TOKEN, WETH_TOKEN],
  addresses: OHM_WETH_LP_ADDRESSES,
  purchaseUrl:
    "https://app.sushi.com/add/0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
});

export const OHM_LUSD_LP_TOKEN = new LPToken({
  decimals: 18,
  name: "OHM-LUSD LP",
  icons: ["OHM", "LUSD"],
  factory: PairContract__factory,
  tokens: [LUSD_TOKEN, OHM_TOKEN],
  addresses: OHM_LUSD_LP_ADDRESSES,
  purchaseUrl:
    "https://app.sushi.com/add/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0/0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5",
});

export const OHM_DAI_LP_TOKEN = new LPToken({
  decimals: 18,
  name: "OHM-DAI LP",
  icons: ["OHM", "DAI"],
  factory: PairContract__factory,
  tokens: [OHM_TOKEN, DAI_TOKEN],
  addresses: OHM_DAI_LP_ADDRESSES,
  purchaseUrl:
    "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x6b175474e89094c44da98b954eedeac495271d0f",
});

export const UST_TOKEN = new Token({
  icons: ["UST"],
  name: "UST",
  decimals: 6,
  addresses: UST_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const FRAX_TOKEN = new Token({
  icons: ["FRAX"],
  name: "FRAX",
  decimals: 18,
  addresses: FRAX_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const WBTC_TOKEN = new Token({
  icons: ["wBTC"],
  name: "WBTC",
  decimals: 8,
  addresses: WBTC_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});
