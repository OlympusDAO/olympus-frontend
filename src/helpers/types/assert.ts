/**
 * Assertion function
 */
export function assert(value: unknown, message: string | Error): asserts value {
  if (!value) throw message instanceof Error ? message : new Error(message);
}
