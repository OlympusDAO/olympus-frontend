import { updateSearchParams } from "src/helpers/SearchParamsHelper";
import { describe, expect, it } from "vitest";

describe("updateSearchParams", () => {
  it("should return a new URLSearchParams object with updated value", () => {
    const params = new URLSearchParams({ foo: "bar" });
    const updatedParams = updateSearchParams(params, "foo", "baz");

    expect(params.get("foo")).toEqual("bar");
    expect(updatedParams.get("foo")).toEqual("baz");
    expect(updatedParams.toString()).toEqual("foo=baz");
  });
});
