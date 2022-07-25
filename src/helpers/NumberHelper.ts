export const getFloat = (input: unknown): number => {
  if (typeof input === "undefined") return 0;

  if (typeof input === "number") return input;

  if (typeof input === "string") return parseFloat(input);

  throw new Error(`Unable to get float value of ${input} with type ${typeof input}`);
};
