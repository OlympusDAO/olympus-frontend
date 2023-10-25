import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

const DECIMAL_PLACES_SHOWN = 4;

export const formatBalance = (balance?: DecimalBigNumber) =>
  balance?.toString({ decimals: DECIMAL_PLACES_SHOWN, trim: false, format: true });
