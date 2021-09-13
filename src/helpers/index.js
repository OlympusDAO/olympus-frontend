import { EPOCH_INTERVAL, BLOCK_RATE_SECONDS, BONDS } from "../constants";
import { ethers } from "ethers";
import { abi as PairContract } from "../abi/PairContract.json";

import { Box, SvgIcon } from "@material-ui/core";
import { ReactComponent as OhmImg } from "../assets/tokens/token_OHM.svg";
import { ReactComponent as SOhmImg } from "../assets/tokens/token_sOHM.svg";

import { ohm_dai } from "./AllBonds";

export async function getMarketPrice({ networkID, provider }) {
  const ohm_dai_address = ohm_dai.getAddressForReserve(networkID, provider);
  const pairContract = new ethers.Contract(ohm_dai_address, PairContract, provider);
  const reserves = await pairContract.getReserves();
  const marketPrice = reserves[1] / reserves[0];

  // commit('set', { marketPrice: marketPrice / Math.pow(10, 9) });
  return marketPrice;
}

export function shorten(str) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

/**
 * trims a Float to `precision` number of decimals
 * @param {Float} number a Float that you want to trim
 * @param {Integer} precision number of decimals that you want
 * @returns {String} trimmedNumber, i.e. `trim(10.012345, 2) => '10.01'`
 */
export function trim(number, precision) {
  if (number == undefined) {
    number = 0;
  }
  const array = number.toString().split(".");
  if (array.length === 1) return number.toString();
  if (precision === 0) return array[0].toString();

  array.push(array.pop().substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}

export function getRebaseBlock(currentBlock) {
  return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
}

export function secondsUntilBlock(startBlock, endBlock) {
  const blocksAway = endBlock - startBlock;
  const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

  return secondsAway;
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

export function prettifySeconds(seconds, resolution) {
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

export const getDateFromSeconds = seconds => {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date;
};

export const subtractDates = (dateA, dateB) => {
  let msA = dateA.getTime();
  let msB = dateB.getTime();

  let diff = msA - msB;

  let days = 0;
  if (diff >= 86400000) {
    days = parseInt(diff / 86400000, 10);
    diff -= days * 86400000;
  }

  let hours = 0;
  if (days || diff >= 3600000) {
    hours = parseInt(diff / 3600000, 10);
    diff -= hours * 3600000;
  }

  let minutes = 0;
  if (hours || diff >= 60000) {
    minutes = parseInt(diff / 60000, 10);
    diff -= minutes * 60000;
  }

  let seconds = 0;
  if (minutes || diff >= 1000) {
    seconds = parseInt(diff / 1000, 10);
  }

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

function getSohmTokenImage() {
  // return (
  //   "data:image/png;base64,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" +
  //   "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" +
  //   "TCYClppcJPRdLAgDKZyxK/tZjCaAEWBIAUCKXosu/FKgAlMDMLgEODgJgs5+DIKDkXxJUAEqGg4MAWGgk6VsO9ikXKgAlM32CPRYNggDs8FaTRr++4TiwJCoAJZam6XNJx6IaAKB4Y01m/W8Nx4EVkQCU3LRBsCnpG7ORAPBIX5PBf2Q4DqyBJYCSmzYIPpf0rSbrcACwKWNNtvdxsI8DqAA4hGoAgA3qi1m/U0gAHERvAIAcjcVav5NYAnBQEASvxU4BAOv7WdIXDP5uogLguDRNdyT9Q1QDACxuJPb1O48KgOOCILjkFEEACxpLOgmC4AsGf/dRAfAITYIA7tAXTX5eIQHwEE2CAGaMRLnfSyQAHkvTtKlJNWDbbCQADBhrcnlP03AcMIQEwHMsCwBe+llSMwiCselAYA4JACRdJwJ/l1QzGwmADepr0uTXNxwHLMAuAEi6PlL4sThSGHDRpaTH0yN8+4ZjgSWoAGAuGgUBJ4wlvQiCgEPB8AkSANyJRAAopbEm6/w/sc6P25AA4F7T/oDnYscAYLuxGPixIBIALIxEALDWWAz8WBIJAJZGIgBYYywGfqyIBAArIxEAjBmLgR9rIgHA2qaJQE00CwKbNhYDP3JCAoBcsWsA2IiRpJ8k/cLAj7yQAGAjponAN+JkQWAdfXFyHzaEBAAblabpjqQX4q4BYBlvNbmop284DjiMBACFmLl06JFYHgDmGYv1fRSIBACFY3kA+Ehf0mtJ/83AjyKRAMCYmarAf0naMhkLULCxpF8kvaXMD1NIAGBcmqZbkp6KqgDc19dkfZ9ufhhHAgCr0CsAB401Wdt/GwTBpdlQgA9IAGCtNE2f6kNlACiTsSazfTr5YS0SAFiPJQKUSF+U+FESJAAolZljh0kGYIu+GPRRQiQAKC2SARjUF4M+So4EAE6YSQb+a/rfLXPRwEFjSZf6sHVvbDIYIA8kAHBSmqY1Ta4qZjcBVjWS9N+azPQvGfThGhIAOG96H8EjTRoJayZjgdXGmszy32pyKt/IYCzAxpEAwDvT6sBTTZKCHZOxwLhLSe/FLB8eIgGA16ZbDGvTPyQE7rvUZMDvS+oz4MNnJADAjGlCsKOPE4ItU/FgLWNNBvx/iRk+8AkSAOAe0x6CHU2Sgj+JKoGtLmf+vOfYXeBuJADACqZ9BH+S9IU+JAVb5iLyyliTDv1LfSjpj5jdA8shAQByMq0UbGuSDPxp5m2sZqyPB/p/a1LGH5kKCHAJCQCwYdPEYEsfKgZ/1CQ52BZVg7E+rNX/W9JvYqAHCkECABg003S4pUli8AdNEoWt6Z9tlTdJGOvDLH4k6f/0YYAfibI9YBQJAFAC06OOt2782Z5++I/T/27PfEn2OZrzsfuMp39mjeZ87N83PjbKPs7sHbDf/wdaj0htca0GeQAAAABJRU5ErkJggg=="
  // );
  return <SvgIcon component={SOhmImg} viewBox="0 0 100 100" style={{ height: "1rem", width: "1rem" }} />;
}

export function getOhmTokenImage(w, h) {
  h !== null ? (h = `${h}px`) : "32px";
  w !== null ? (w = `${w}px`) : "32px";
  return <SvgIcon component={OhmImg} viewBox="0 0 32 32" style={{ height: h, width: w }} />;
}

export function getTokenImage(name) {
  if (name === "ohm") return getOhmTokenImage();
  if (name === "sohm") return getSohmTokenImage();
}

// this is only used by numberWithCommas
export function stringWithPrecision(val, options = {}) {
  let precision = 2;
  if (options.precision !== undefined) {
    precision = options.precision;
  }

  val = val.toString();

  if (val && typeof val.indexOf === "function") {
    return val.substr(0, val.indexOf(".") + precision + 1);
  } else {
    return val;
  }
}

/**
 * Pretty up a BigNumber using it's corresponding ERC20 decimals value with the proper amount of
 * trailing decimal precision
 * @param {*} amount BigNumber|string|number to format
 * @param {*} decimals precision to use when converting from BigNumber to string
 * example: a BigNumber value of 123456 for WBTC which has 8 decimals of precision
 *          would be formatted as: 0.00123456
 */
export const numberWithCommas = (amount, options = {}) => {
  if (options.decimals === undefined || options.decimals === null) {
    options.decimals = TOKEN_DECIMALS;
  }

  if (!amount) {
    return;
  }

  const amountFormatted =
    typeof amount === "string" || typeof amount === "number"
      ? amount
      : ethers.utils.formatUnits(amount, options.decimals);

  if (!options.precision && options.precision !== 0) {
    options.precision = getPrecision(amountFormatted);
  }

  return _formatCommas(amountFormatted, options);
};

function _formatCommas(str, options = {}) {
  if (!str) {
    return typeof str === "number" ? str : "";
  }

  let precision = 2;
  if (options.precision !== undefined) {
    precision = options.precision;
  }

  let localeString = "en-GB";
  if (options.currentLang && options.currentLang === "es") {
    localeString = "es-ES";
  }

  // auto-round to the nearest whole number
  if (precision === 0) {
    str = Math.floor(Number(str));
  }

  // handle exponents
  if (str.toString().match("e")) {
    str = Number.parseFloat(str).toFixed(0);
  }

  let parts = str.toString().split(".");
  parts[0] = parts[0].replace(",", "");

  let numberStr = "";

  if (parts.length > 1 && precision > 0) {
    numberStr = stringWithPrecision(parts.join("."), { precision });
  } else {
    numberStr = parts[0];
  }

  if (options.removeTrailingZeros) {
    numberStr = numberStr.replace(/(\.0+|0+)$/, "");
  }

  return Number(numberStr).toLocaleString(localeString, {
    minimumFractionDigits: options.removeTrailingZeros ? 0 : precision,
  });
}

/**
 * Returns a standardized decimal precision depending on the number
 * @param {*} num number to check
 */
export const getPrecision = num => {
  num = parseFloat(num);

  if (num > 10000) {
    return 0;
  } else if (num >= 0.1) {
    return 2;
  } else {
    return getMinPrecision(num);
  }
};

/**
 * Returns the number of digits after a decimal place
 * @param {*} num number to check
 */
export const getMaxPrecision = num => {
  return String(num).split(".")[1]?.length || 0;
};

/**
 * Counts the number of 0's past a decimal in a number and returns how many significant digits to keep
 * plus additional digits so we always show a non-zero number.
 * @param {*} num number to check
 * @param {*} options
 *    additionalDigits: Optional additional digits to keep past the first non-zero number
 */
export const getMinPrecision = (num, options = { additionalDigits: 2 }) => {
  const { additionalDigits } = options;
  const decimals = String(num).split(".")[1];

  if (decimals === "0") return 0;
  if (!decimals) return additionalDigits;
  return decimals.match(/^0*/)[0].length + additionalDigits;
};
export function setAll(state, properties) {
  const props = Object.keys(properties);
  props.forEach(key => {
    state[key] = properties[key];
  });
}

export const setBondState = (state, payload) => {
  const bond = payload.bond;
  const newState = { ...state[bond], ...payload };
  state[bond] = newState;
};
