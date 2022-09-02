/**
 * Returns a copy of the supplied URLSearchParams with an updated value.
 *
 * @param params
 * @param param
 * @param value
 * @returns
 */
export const updateSearchParams = (params: URLSearchParams, param: string, value: string): URLSearchParams => {
  const updated = new URLSearchParams(params);
  updated.set(param, value);

  return updated;
};
