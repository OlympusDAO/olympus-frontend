export const NEW_DEPOSIT = "-1";
/**
 * We set the decimals amount to 9 to try to limit any precision issues with
 * sOHM and gOHM conversions on the contract side
 */
export const GIVE_MAX_DECIMALS = 9;
/**
 * An options preset to be used with `DecimalBigNumber` that enforces a reasonable number
 * decimal places to limit precision issues with sOHM and gOHM conversions.
 */
export const GIVE_MAX_DECIMAL_FORMAT = { decimals: GIVE_MAX_DECIMALS, format: false };
