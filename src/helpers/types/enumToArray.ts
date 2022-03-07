/**
 * Converts a typescript enum to an array of it's values
 */
export const enumToArray = (_enum: any) => {
  const values = Object.values(_enum);

  return values.splice(values.length / 2);
};
