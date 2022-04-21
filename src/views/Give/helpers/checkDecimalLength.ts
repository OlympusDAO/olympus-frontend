import { GIVE_MAX_DECIMALS } from "../constants";

export const checkDecimalLength = (value: string): string => {
  const [value_, decimalsOrUndefined_] = value.split(".");

  if (!decimalsOrUndefined_) return value;

  let decimals_ = decimalsOrUndefined_;

  if (decimalsOrUndefined_.length > 9) {
    decimals_ = decimalsOrUndefined_.slice(0, GIVE_MAX_DECIMALS);
  }

  return value_ + "." + decimals_;
};

export const removeTrailingZeros = (decimals: string): string => {
  for (let i = decimals.length - 1; i > 0; i--) {
    if (decimals[i] === "0") {
      decimals = decimals.slice(0, i);
    } else {
      break;
    }
  }

  return decimals;
};
