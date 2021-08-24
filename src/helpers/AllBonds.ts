import { StableBond, LPBond, NetworkID } from "src/lib/Bond";

import DaiImg from "src/assets/tokens/DAI.svg";
import OhmDaiImg from "src/assets/tokens/OHM-DAI.svg";
import FraxImg from "src/assets/tokens/FRAX.svg";
import OhmFraxImg from "src/assets/tokens/OHM-FRAX.svg";
import wETHImg from "src/assets/tokens/wETH.svg";

import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as FraxOhmBondContract } from "src/abi/bonds/OhmFraxContract.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as ReserveOhmFraxContract } from "src/abi/reserves/OhmFrax.json";
import { abi as FraxBondContract } from "src/abi/bonds/FraxContract.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";

//Careful about calling the constructor, since a bunch of the parameters are just "string"

const dai = new StableBond("dai", "DAI", DaiImg, DaiBondContract, {
  [NetworkID.Mainnet]: {
    bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
    reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  [NetworkID.Testnet]: {
    bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
    reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
  },
});

const frax = new StableBond("frax", "FRAX", FraxImg, FraxBondContract, {
  [NetworkID.Mainnet]: {
    bondAddress: "0x8510c8c2B6891E04864fa196693D44E6B6ec2514",
    reserveAddress: "0x853d955acef822db058eb8505911ed77f175b99e",
  },
  [NetworkID.Testnet]: {
    bondAddress: "0xF651283543fB9D61A91f318b78385d187D300738",
    reserveAddress: "0x2F7249cb599139e560f0c81c269Ab9b04799E453",
  },
});

const eth = new StableBond("eth", "wETH", wETHImg, EthBondContract, {
  [NetworkID.Mainnet]: {
    bondAddress: "0xE6295201CD1ff13CeD5f063a5421c39A1D236F1c",
    reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  [NetworkID.Testnet]: {
    bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
    reserveAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
  },
});

const ohm_dai = new LPBond(
  "ohm_dai",
  "OHM-DAI SLP",
  "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0x6b175474e89094c44da98b954eedeac495271d0f",
  OhmDaiImg,
  BondOhmDaiContract,
  ReserveOhmDaiContract,
  {
    [NetworkID.Mainnet]: {
      bondAddress: "0x956c43998316b6a2F21f89a1539f73fB5B78c151",
      reserveAddress: "0x34d7d7Aaf50AD4944B70B320aCB24C95fa2def7c",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
  },
);

const ohm_frax = new LPBond(
  "ohm_frax",
  "OHM-FRAX SLP",
  OhmFraxImg,
  "https://app.uniswap.org/#/add/v2/0x853d955acef822db058eb8505911ed77f175b99e/0x383518188c0c6d7730d91b2c03a03c837814a899",
  FraxOhmBondContract,
  ReserveOhmFraxContract,
  {
    [NetworkID.Mainnet]: {
      bondAddress: "0xc20CffF07076858a7e642E396180EC390E5A02f7",
      reserveAddress: "0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x7BB53Ef5088AEF2Bb073D9C01DCa3a1D484FD1d2",
      reserveAddress: "0x11BE404d7853BDE29A3e73237c952EcDCbBA031E",
    },
  },
);

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [dai, frax, eth, ohm_dai, ohm_frax];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

console.log(allBondsMap);
