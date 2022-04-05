export const countDecimals = (value: string): number => {
  const number = Number(value);
  if (Math.floor(number) !== number) {
    return value.split(".")[1].length || 0;
  }
  return 0;
};
