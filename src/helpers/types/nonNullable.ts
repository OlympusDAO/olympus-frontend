/**
 * Type safe check for non defined values
 */
export function nonNullable<Type>(value: Type): value is NonNullable<Type> {
  return value !== null && value !== undefined;
}
