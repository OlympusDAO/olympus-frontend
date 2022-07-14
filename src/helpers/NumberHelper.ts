export const getFloat = (input: any): number => {
  return typeof input === "number" ? input : parseFloat(input);
};
