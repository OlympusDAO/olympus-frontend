declare module "*.jpg";
declare module "*.png";
declare module "*.svg";

interface unstable_ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}

type ObjectKeys<T> = T extends object
  ? (keyof T)[]
  : T extends number
  ? []
  : T extends Array<any> | string
  ? string[]
  : never;
