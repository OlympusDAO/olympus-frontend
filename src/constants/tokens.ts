import {
  DAI_ADDRESSES,
  FRAX_ADDRESSES,
  GOHM_ADDRESSES,
  LUSD_ADDRESSES,
  OHM_ADDRESSES,
  OHM_DAI_BALANCER_LP_ADDRESSES,
  OHM_DAI_LP_ADDRESSES,
  SOHM_ADDRESSES,
  UST_ADDRESSES,
  V1_OHM_ADDRESSES,
  V1_SOHM_ADDRESSES,
  WBTC_ADDRESSES,
  WETH_ADDRESSES,
  WSOHM_ADDRESSES,
} from "src/constants/addresses";
import { BALANCER_VAULT } from "src/constants/contracts";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { calculateUniOrSushiLPValue } from "src/helpers/pricing/calculateUniOrSushiLPValue";
import { NetworkId } from "src/networkDetails";
import { BalancerV2Pool__factory, IERC20__factory, PairContract__factory } from "src/typechain";

export const OHM_TOKEN = new Token({
  icons: ["OHM"],
  name: "OHM",
  decimals: 9,
  addresses: OHM_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "https://app.balancer.fi/#/trade/ether/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
});

export const SOHM_TOKEN = new Token({
  icons: ["sOHM"],
  name: "sOHM",
  decimals: 9,
  addresses: SOHM_ADDRESSES,
  factory: IERC20__factory,
  customPricingFunc: OHM_TOKEN.getPrice,
  purchaseUrl: "https://app.balancer.fi/#/trade/ether/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
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
 * We have to add the custom pricing func after
 * the token has been initialised to prevent
 * circular references during initialisation.
 */
DAI_TOKEN.customPricingFunc = async () => {
  // WHY DO WE FIX DAI to $1 in BOND PRICING?
  // because we are trying to give the user a price in USD and
  // there is no such thing as USD on chain. If we wanted to be
  // more precise we could give a price in DAI like 13.59 DAI
  // rather than $13.59
  return new DecimalBigNumber("1", 18);
};

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
    [NetworkId.TESTNET_GOERLI]: DAI_ADDRESSES[NetworkId.TESTNET_GOERLI],
  },
  factory: IERC20__factory,
  purchaseUrl: "",
});

/**
 * We have to add the custom pricing func after
 * the token has been initialised to prevent
 * circular references during initialisation.
 */
TEST_DAI_TOKEN.customPricingFunc = async () => {
  return new DecimalBigNumber("1", 18);
};

export const LUSD_TOKEN = new Token({
  icons: ["LUSD"],
  name: "LUSD",
  decimals: 18,
  addresses: LUSD_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const OHM_DAI_LP_TOKEN = new Token({
  decimals: 18,
  name: "OHM-DAI LP",
  icons: ["OHM", "DAI"],
  factory: PairContract__factory,
  addresses: OHM_DAI_LP_ADDRESSES,
  purchaseUrl:
    "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x6b175474e89094c44da98b954eedeac495271d0f",
});

OHM_DAI_LP_TOKEN.customPricingFunc = networkId =>
  calculateUniOrSushiLPValue({ networkId, lpToken: OHM_DAI_LP_TOKEN, poolTokens: [OHM_TOKEN, DAI_TOKEN] });

export const OHM_DAI_BALANCER_LP_TOKEN = new Token({
  decimals: 18,
  name: "50OHM-50DAI",
  icons: ["OHM", "DAI"],
  factory: BalancerV2Pool__factory,
  addresses: OHM_DAI_BALANCER_LP_ADDRESSES,
  purchaseUrl: "https://app.balancer.fi/#/trade",
});

OHM_DAI_BALANCER_LP_TOKEN.customPricingFunc = async () => {
  const contract = OHM_DAI_BALANCER_LP_TOKEN.getEthersContract(NetworkId.MAINNET);
  const vault = BALANCER_VAULT.getEthersContract(NetworkId.MAINNET);
  const poolId = await contract.getPoolId();
  const poolTokens = await vault.getPoolTokens(poolId);
  const daiPrice = await DAI_TOKEN.getPrice(NetworkId.MAINNET);
  const daiUSDValue = daiPrice.mul(new DecimalBigNumber(poolTokens.balances[1], 18));

  return daiUSDValue.div(new DecimalBigNumber(poolTokens.balances[0], 9));
};

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

/**
 * We have to add the custom pricing func after
 * the token has been initialised to prevent
 * circular references during initialisation.
 */
OHM_TOKEN.customPricingFunc = async () => {
  return OHM_DAI_BALANCER_LP_TOKEN.getPrice(NetworkId.MAINNET);
};
