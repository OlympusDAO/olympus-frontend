import { assert } from "src/helpers/types/assert";
import { describe, expect, it } from "vitest";

describe("Assert", () => {
  it("should throw the defined message when string", async () => {
    const theDefinedMessage = "the error message";

    const shouldThrow = async () => {
      assert(undefined !== undefined, theDefinedMessage);
    };
    await expect(shouldThrow()).rejects.toThrow(theDefinedMessage);
  });

  it("should throw the defined message when Error", async () => {
    const theDefinedMessage = new Error("the error message");

    const shouldThrow = async () => {
      assert(undefined !== undefined, theDefinedMessage);
    };
    await expect(shouldThrow()).rejects.toThrow(theDefinedMessage);
  });

  it("should resolve undefined when assertion is true", () => {
    expect(assert(("1" as string) !== ("2" as string), "whatever")).toEqual(undefined);
    expect(assert(1 === 1, "whatever")).toEqual(undefined);
  });
});
