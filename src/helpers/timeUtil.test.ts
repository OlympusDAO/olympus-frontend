import { prettifySeconds, prettifySecondsInDays } from "src/helpers/timeUtil";
import { describe, expect, it } from "vitest";

describe("prettifySeconds", () => {
  const oneMinute = 70;
  const oneHour = 3600;
  const oneDay = 86400;

  it("returns an empty string if input is not a number", () => {
    // @ts-expect-error
    expect(prettifySeconds(undefined)).toEqual("");
    // @ts-expect-error
    expect(prettifySeconds(null)).toEqual("");
    expect(prettifySeconds("test" as any)).toEqual("");
    expect(prettifySeconds(NaN)).toEqual("");
  });

  it("returns prettified string with hours and minutes", () => {
    expect(prettifySeconds(oneMinute)).toEqual("1 min");
    expect(prettifySeconds(oneHour)).toEqual("1 hr");
    expect(prettifySeconds(oneHour + oneMinute)).toEqual("1 hr, 1 min");
    expect(prettifySeconds(oneDay)).toEqual("1 day");
    expect(prettifySeconds(oneDay * 2)).toEqual("2 days");
    expect(prettifySeconds(oneDay * 2 + oneMinute)).toEqual("2 days, 1 min");
    expect(prettifySeconds(oneDay * 2 + oneMinute + oneHour)).toEqual("2 days, 1 hr, 1 min");

    expect(prettifySeconds(oneHour + oneMinute * 2)).toEqual("1 hr, 2 mins");
    expect(prettifySeconds(oneDay * 2 + oneMinute * 2 + oneHour)).toEqual("2 days, 1 hr, 2 mins");
    expect(prettifySeconds(oneDay * 2 + oneMinute * 2 + oneHour * 2)).toEqual("2 days, 2 hrs, 2 mins");
  });

  it("returns prettified string with days only", () => {
    // all of the above tests but with day precision
    expect(prettifySeconds(oneMinute, "day")).toEqual("0 days");
    expect(prettifySeconds(oneHour, "day")).toEqual("0 days");
    expect(prettifySeconds(oneHour + oneMinute, "day")).toEqual("0 days");
    expect(prettifySeconds(oneDay, "day")).toEqual("1 day");
    expect(prettifySeconds(oneDay * 2, "day")).toEqual("2 days");
    expect(prettifySeconds(oneDay * 2 + oneMinute, "day")).toEqual("2 days");
    expect(prettifySeconds(oneDay * 2 + oneMinute + oneHour, "day")).toEqual("2 days");

    expect(prettifySeconds(oneHour + oneMinute * 2, "day")).toEqual("0 days");
    expect(prettifySeconds(oneDay * 2 + oneMinute * 2 + oneHour, "day")).toEqual("2 days");
    expect(prettifySeconds(oneDay * 2 + oneMinute * 2 + oneHour * 2, "day")).toEqual("2 days");
  });
});

describe("prettifySecondsInDays", () => {
  it("returns empty string if input is not a number", () => {
    // @ts-expect-error
    expect(prettifySecondsInDays(undefined)).toEqual("");
    // @ts-expect-error
    expect(prettifySecondsInDays(null)).toEqual("");
    expect(prettifySecondsInDays("test" as any)).toEqual("");
    expect(prettifySecondsInDays(NaN)).toEqual("");
  });

  it("returns prettified string with days", () => {
    expect(prettifySecondsInDays(86400)).toEqual("1 day");
    expect(prettifySecondsInDays(172800)).toEqual("2 days");
  });
});
