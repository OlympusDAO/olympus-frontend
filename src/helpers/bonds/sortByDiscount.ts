import { Bond } from "src/views/Bond/hooks/useBonds";

export const sortByDiscount = (bonds: Bond[]) => {
  return Array.from(bonds).sort((a, b) => (a.discount.gt(b.discount) ? -1 : 1));
};
