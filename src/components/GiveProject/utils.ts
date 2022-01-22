export const countDecimals = (value: string): number => {
  const number = Number(value);
  if (Math.floor(number) !== number) {
    return value.split(".")[1].length || 0;
  }
  return 0;
};

export const roundToDecimal = (value: string): number => {
  return Math.round(Number(value) * 100) / 100;
};

export const toInteger = (value: string): number => {
  return Math.trunc(Number(value));
};
