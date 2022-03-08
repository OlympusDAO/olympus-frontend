/**
 * Assertion function helpful for asserting `enabled`
 * values from within a `react-query` function.
 * @param value The value(s) to assert
 * @param queryKey Key of current query
 */
export function queryAssertion(value: unknown, queryKey: any = "not specified"): asserts value {
  if (!value) throw new Error(`Failed react-query assertion for key: ${queryKey}`);
}
