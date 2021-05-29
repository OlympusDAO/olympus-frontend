export { default as Transactor } from "./Transactor";

export function trim(number, precision) {
  if (number == undefined) {
    number = 0;
  }
  const array = number.toString().split('.');
  if (array.length === 1)
    return number.toString();

  array.push(array.pop().substring(0, precision));
  const trimmedNumber = array.join('.');
  return trimmedNumber;
}
