import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as OhmDaiImg } from "src/assets/tokens/OHM-DAI.svg";
import { ReactComponent as FraxImg } from "src/assets/tokens/FRAX.svg";
import { ReactComponent as OhmFraxImg } from "src/assets/tokens/OHM-FRAX.svg";
import { ReactComponent as OhmLusdImg } from "src/assets/tokens/OHM-LUSD.svg";
import { ReactComponent as OhmEthImg } from "src/assets/tokens/OHM-WETH.svg";
import { ReactComponent as wETHImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as LusdImg } from "src/assets/tokens/LUSD.svg";
import { ReactComponent as CvxImg } from "src/assets/tokens/CVX.svg";

import { abi as FraxOhmBondContract } from "src/abi/bonds/OhmFraxContract.json";
import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as BondOhmLusdContract } from "src/abi/bonds/OhmLusdContract.json";
import { abi as BondOhmEthContract } from "src/abi/bonds/OhmEthContract.json";

import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ReserveOhmLusdContract } from "src/abi/reserves/OhmLusd.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as ReserveOhmFraxContract } from "src/abi/reserves/OhmFrax.json";
import { abi as ReserveOhmEthContract } from "src/abi/reserves/OhmEth.json";

import { abi as FraxBondContract } from "src/abi/bonds/FraxContract.json";
import { abi as LusdBondContract } from "src/abi/bonds/LusdContract.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import { abi as CvxBondContract } from "src/abi/bonds/CvxContract.json";

import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { getBondCalculator } from "src/helpers/BondCalculator";
import { BigNumberish } from "ethers";
import { getTokenPrice } from "src/helpers";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  payoutToken: "OHM",
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
      reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
  },
});

export const frax = new StableBond({
  name: "frax",
  displayName: "FRAX",
  bondToken: "FRAX",
  payoutToken: "OHM",
  bondIconSvg: FraxImg,
  bondContractABI: FraxBondContract,
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x8510c8c2B6891E04864fa196693D44E6B6ec2514",
      reserveAddress: "0x853d955acef822db058eb8505911ed77f175b99e",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xF651283543fB9D61A91f318b78385d187D300738",
      reserveAddress: "0x2F7249cb599139e560f0c81c269Ab9b04799E453",
    },
  },
});

export const lusd = new StableBond({
  name: "lusd",
  displayName: "LUSD",
  bondToken: "LUSD",
  payoutToken: "OHM",
  bondIconSvg: LusdImg,
  bondContractABI: LusdBondContract,
  isBondable: {
    [NetworkID.Mainnet]: false,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x10C0f93f64e3C8D0a1b0f4B87d6155fd9e89D08D",
      reserveAddress: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x3aD02C4E4D1234590E87A1f9a73B8E0fd8CF8CCa",
      reserveAddress: "0x45754dF05AA6305114004358eCf8D04FF3B84e26",
    },
  },
});

export const eth = new CustomBond({
  name: "eth",
  displayName: "wETH",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "wETH",
  payoutToken: "OHM",
  bondIconSvg: wETHImg,
  bondContractABI: EthBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xE6295201CD1ff13CeD5f063a5421c39A1D236F1c",
      reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
      reserveAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const ethBondContract = this.getContractForBond(networkID, provider);
    let ethPrice: BigNumberish = await ethBondContract.assetPrice();
    ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
    const token = this.getContractForReserve(networkID, provider);
    let ethAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    ethAmount = Number(ethAmount.toString()) / Math.pow(10, 18);
    return ethAmount * ethPrice;
  },
});

export const cvx = new CustomBond({
  name: "cvx",
  displayName: "CVX",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "CVX",
  payoutToken: "OHM",
  bondIconSvg: CvxImg,
  bondContractABI: CvxBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  isBondable: {
    [NetworkID.Mainnet]: false,
    [NetworkID.Testnet]: false,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x767e3459A35419122e5F6274fB1223d75881E0a9",
      reserveAddress: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xd43940687f6e76056789d00c43A40939b7a559b5",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // using DAI per `principal` address
      // reserveAddress: "0x6761Cb314E39082e08e1e697eEa23B6D1A77A34b", // guessed
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    let cvxPrice: number = await getTokenPrice("convex-finance");
    const token = this.getContractForReserve(networkID, provider);
    let cvxAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    cvxAmount = Number(cvxAmount.toString()) / Math.pow(10, 18);
    return cvxAmount * cvxPrice;
  },
});

// the old convex bonds. Just need to be claimable for the users who previously purchased
export const cvx_expired = new CustomBond({
  name: "cvx-v1",
  displayName: "CVX OLD",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "CVX",
  payoutToken: "OHM",
  bondIconSvg: CvxImg,
  bondContractABI: CvxBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  isBondable: {
    [NetworkID.Mainnet]: false,
    [NetworkID.Testnet]: false,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x6754c69fe02178f54ADa19Ebf1C5569826021920",
      reserveAddress: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xd43940687f6e76056789d00c43A40939b7a559b5",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // using DAI per `principal` address
      // reserveAddress: "0x6761Cb314E39082e08e1e697eEa23B6D1A77A34b", // guessed
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    let cvxPrice: number = await getTokenPrice("convex-finance");
    const token = this.getContractForReserve(networkID, provider);
    let cvxAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    cvxAmount = Number(cvxAmount.toString()) / Math.pow(10, 18);
    return cvxAmount * cvxPrice;
  },
});

export const ohm_dai = new LPBond({
  name: "ohm_dai_lp",
  displayName: "OHM-DAI LP",
  bondToken: "DAI",
  payoutToken: "OHM",
  bondIconSvg: OhmDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  isBondable: {
    [NetworkID.Mainnet]: false,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x956c43998316b6a2F21f89a1539f73fB5B78c151",
      reserveAddress: "0x34d7d7Aaf50AD4944B70B320aCB24C95fa2def7c",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0x6b175474e89094c44da98b954eedeac495271d0f",
});

export const ohm_frax = new LPBond({
  name: "ohm_frax_lp",
  displayName: "OHM-FRAX LP",
  bondToken: "FRAX",
  payoutToken: "OHM",
  bondIconSvg: OhmFraxImg,
  bondContractABI: FraxOhmBondContract,
  reserveContract: ReserveOhmFraxContract,
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xc20CffF07076858a7e642E396180EC390E5A02f7",
      reserveAddress: "0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x7BB53Ef5088AEF2Bb073D9C01DCa3a1D484FD1d2",
      reserveAddress: "0x11BE404d7853BDE29A3e73237c952EcDCbBA031E",
    },
  },
  lpUrl:
    "https://app.uniswap.org/#/add/v2/0x853d955acef822db058eb8505911ed77f175b99e/0x383518188c0c6d7730d91b2c03a03c837814a899",
});

export const ohm_lusd = new LPBond({
  name: "ohm_lusd_lp",
  displayName: "OHM-LUSD LP",
  bondToken: "LUSD",
  payoutToken: "OHM",
  bondIconSvg: OhmLusdImg,
  bondContractABI: BondOhmLusdContract,
  reserveContract: ReserveOhmLusdContract,
  isBondable: {
    [NetworkID.Mainnet]: false,
    [NetworkID.Testnet]: false,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xFB1776299E7804DD8016303Df9c07a65c80F67b6",
      reserveAddress: "0xfDf12D1F85b5082877A6E070524f50F6c84FAa6b",
    },
    [NetworkID.Testnet]: {
      // NOTE (appleseed-lusd): using ohm-dai rinkeby contracts
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x383518188C0C6d7730D91b2c03a03C837814a899/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
});

export const ohm_weth = new CustomBond({
  name: "ohm_weth_lp",
  displayName: "OHM-WETH LP",
  bondToken: "WETH",
  payoutToken: "OHM",
  bondIconSvg: OhmEthImg,
  bondContractABI: BondOhmEthContract,
  reserveContract: ReserveOhmEthContract,
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.Arbitrum]: false,
    [NetworkID.ArbitrumTestnet]: false,
    [NetworkID.Avalanche]: false,
    [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xB6C9dc843dEc44Aa305217c2BbC58B44438B6E16",
      reserveAddress: "0xfffae4a0f4ac251f4705717cd24cadccc9f33e06",
    },
    [NetworkID.Testnet]: {
      // NOTE (unbanksy): using ohm-dai rinkeby contracts
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
  },
  bondType: BondType.LP,
  lpUrl:
    "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    if (networkID === NetworkID.Mainnet) {
      const ethBondContract = this.getContractForBond(networkID, provider);
      let ethPrice: BigNumberish = await ethBondContract.assetPrice();
      ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
      const token = this.getContractForReserve(networkID, provider);
      const tokenAddress = this.getAddressForReserve(networkID);
      const bondCalculator = getBondCalculator(networkID, provider);
      const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
      const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
      const markdown = await bondCalculator.markdown(tokenAddress || "");
      let tokenUSD =
        (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
      return tokenUSD * Number(ethPrice.toString());
    } else {
      // NOTE (appleseed): using OHM-DAI on rinkeby
      const token = this.getContractForReserve(networkID, provider);
      const tokenAddress = this.getAddressForReserve(networkID);
      const bondCalculator = getBondCalculator(networkID, provider);
      const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
      const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
      const markdown = await bondCalculator.markdown(tokenAddress || "");
      let tokenUSD =
        (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
      return tokenUSD;
    }
  },
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [dai, frax, eth, cvx, ohm_dai, ohm_frax, lusd, ohm_lusd, ohm_weth];
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
export const allExpiredBonds = [cvx_expired];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
