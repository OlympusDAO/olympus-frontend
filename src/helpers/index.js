import { ethers } from "ethers";
import { addresses, EPOCH_INTERVAL, BLOCK_RATE_SECONDS, BONDS } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as PairContract } from "../abi/PairContract.json";
import { abi as BondOhmDaiContract } from "../abi/bonds/OhmDaiContract.json";
import { abi as BondOhmFraxContract } from "../abi/bonds/OhmFraxContract.json";
import { abi as BondDaiContract } from "../abi/bonds/DaiContract.json";
import { abi as ReserveOhmDaiContract } from "../abi/reserves/OhmDai.json";
import { abi as ReserveOhmFraxContract } from "../abi/reserves/OhmFrax.json";
import { abi as BondContract } from "../abi/BondContract.json";
import { abi as DaiBondContract } from "../abi/DaiBondContract.json";
import { abi as FraxBondContract } from "../abi/bonds/FraxContract.json";

export { default as Transactor } from "./Transactor";

export function addressForBond({ bond, networkID }) {
  switch (bond) {
    case BONDS.ohm_dai:
      return addresses[networkID].BONDS.OHM_DAI;

    case BONDS.dai:
      return addresses[networkID].BONDS.DAI;

    case BONDS.ohm_frax:
      return addresses[networkID].BONDS.OHM_FRAX;

    case BONDS.frax:
      return addresses[networkID].BONDS.FRAX;

    default:
      return null;
  }
}

export function addressForAsset({ bond, networkID }) {
  switch (bond) {
    case BONDS.ohm_dai:
      return addresses[networkID].RESERVES.OHM_DAI;

    case BONDS.dai:
      return addresses[networkID].RESERVES.DAI;

    case BONDS.ohm_frax:
      return addresses[networkID].RESERVES.OHM_FRAX;

    case BONDS.frax:
      return addresses[networkID].RESERVES.FRAX;

    default:
      return null;
  }
}

export function isBondLP(bond) {
  return bond.indexOf("_lp") >= 0;
}

export function lpURL(bond) {
  switch (bond) {
    case BONDS.ohm_dai:
      return "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0x6b175474e89094c44da98b954eedeac495271d0f";

    case BONDS.ohm_frax:
      return "https://app.uniswap.org/#/add/v2/0x853d955acef822db058eb8505911ed77f175b99e/0x383518188c0c6d7730d91b2c03a03c837814a899";

    default:
      return null;
  }
}

export function bondName(bond) {
  switch (bond) {
    case BONDS.dai:
      return "DAI Bond";

    case BONDS.ohm_dai:
      return "OHM-DAI SLP Bond";

    case BONDS.ohm_frax:
      return "OHM-FRAX LP Bond";

    case BONDS.frax:
      return "FRAX Bond";

    default:
      return null;
  }
}

export function contractForBond({ bond, networkID, provider }) {
  const address = addressForBond({ bond, networkID });

  switch (bond) {
    case BONDS.ohm_dai:
      return new ethers.Contract(addresses[networkID].BONDS.OHM_DAI, BondOhmDaiContract, provider);

    case BONDS.dai:
      return new ethers.Contract(addresses[networkID].BONDS.DAI, BondDaiContract, provider);

    case BONDS.ohm_dai_v1:
      return new ethers.Contract(addresses[networkID].BOND_ADDRESS, BondContract, provider);

    case BONDS.dai_v1:
      return new ethers.Contract(addresses[networkID].DAI_BOND_ADDRESS, DaiBondContract, provider);

    case BONDS.ohm_frax:
      return new ethers.Contract(addresses[networkID].BONDS.OHM_FRAX, BondOhmFraxContract, provider);

    case BONDS.ohm_frax_v1:
      return new ethers.Contract(addresses[networkID].BONDS.OHM_FRAX_BOND_ADDRESS, BondOhmFraxContract, provider);

    case BONDS.frax:
      return new ethers.Contract(address, FraxBondContract, provider);

    default:
      return null;
  }
}

export function contractForReserve({ bond, networkID, provider }) {
  const address = addressForAsset({ bond, networkID });

  switch (bond) {
    case BONDS.ohm_dai:
    case BONDS.ohm_dai_v1:
      return new ethers.Contract(addresses[networkID].RESERVES.OHM_DAI, ReserveOhmDaiContract, provider);

    case BONDS.dai:
    case BONDS.dai_v1:
      return new ethers.Contract(addresses[networkID].RESERVES.DAI, ierc20Abi, provider);

    case BONDS.ohm_frax:
    case BONDS.ohm_frax_v1:
      return new ethers.Contract(addresses[networkID].RESERVES.OHM_FRAX, ReserveOhmFraxContract, provider);

    case BONDS.frax:
      return new ethers.Contract(address, ierc20Abi, provider);

    default:
      return null;
  }
}

export async function getMarketPrice({ networkID, provider }) {
  const pairContract = new ethers.Contract(addresses[networkID].LP_ADDRESS, PairContract, provider);
  const reserves = await pairContract.getReserves();

  return reserves[1] / reserves[0];
}

export function shorten(str) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function trim(number, precision) {
  if (number === undefined) {
    number = 0;
  }

  const array = number.toString().split(".");

  if (array.length === 1) {
    return number.toString();
  }

  array.push(array.pop().substring(0, precision));

  return array.join(".");
}

export function getRebaseBlock(currentBlock) {
  return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
}

export function secondsUntilBlock(startBlock, endBlock) {
  if (startBlock % EPOCH_INTERVAL === 0) {
    return 0;
  }

  const blocksAway = endBlock - startBlock;

  return blocksAway * BLOCK_RATE_SECONDS;
}

export function prettifySeconds(seconds, resolution) {
  if (seconds !== 0 && !seconds) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (resolution === "day") {
    return d + (d === 1 ? " day" : " days");
  }

  const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h === 1 ? " hr, " : " hrs, ") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? " min" : " mins") : "";

  return dDisplay + hDisplay + mDisplay;
}

export function prettyVestingPeriod(currentBlock, vestingBlock) {
  if (vestingBlock === 0) {
    return "";
  }

  const seconds = secondsUntilBlock(currentBlock, vestingBlock);
  if (seconds < 0) {
    return "Fully Vested";
  }
  return prettifySeconds(seconds);
}

export async function calculateAPY(sohmContract, stakingReward) {
  const circSupply = await sohmContract.circulatingSupply();

  const stakingRebase = stakingReward / circSupply;

  return Math.pow(1 + stakingRebase, 365 * 3) - 1;
}
