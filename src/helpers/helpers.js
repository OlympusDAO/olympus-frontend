export const BOND_AMOUNT = 10;
// Sometimes we need to round float values because bigint type does not exist (yet) in javascript
export function round(val) {
  var m = Math.pow(10, 10);
  return Math.round(parseFloat(val) * m) / m;
}
