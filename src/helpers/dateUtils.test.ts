import { addSeconds, format, nowInMilliseconds } from "./dateUtils";

test("adds seconds to the date with addSeconds()", () => {
  const startOf2021 = new Date("01-Jan-2021 00:00:00");
  const secondsAdded = 60;
  expect(addSeconds(startOf2021, secondsAdded)).toEqual(new Date("01-Jan-2021 00:01:00"));
});

test("format date accordingly with format()", () => {
  const startOf2021 = new Date("01-Jan-2021 00:00:00");
  expect(format(startOf2021, "MMMM yyyy")).toBe("January 2021");
  expect(format(startOf2021, "MMM yy")).toBe("Jan 21");
  expect(format(startOf2021, "MM dd")).toBe("01 01");
});

test("return now in ms with nowInMilliseconds()", () => {
  // Expecting Unix time here so has to be longer than 13 digits
  // Last date with 13 digits here is Sun Nov 21 2286.
  const unixMsTimeDigitsNumber = 13;
  expect(nowInMilliseconds().toString().length).toBe(unixMsTimeDigitsNumber);
});
