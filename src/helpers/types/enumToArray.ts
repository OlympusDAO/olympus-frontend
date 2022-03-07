export const enumToArray = (_enum: any) => {
  const values = Object.values(_enum);

  return values.splice(values.length / 2);
};
