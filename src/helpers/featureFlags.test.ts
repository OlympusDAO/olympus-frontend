import "@testing-library/jest-dom";
import { isFeatureEnabled } from "./featureFlags";

describe("featureFlags", () => {
  it("should return true if featureFlag is enabled", () => {
    process.env.TEST_FLAG = "enabled";
    expect(isFeatureEnabled("TEST_FLAG")).toBe(true);
  });
  it("should return false if featureFlag is disabled", () => {
    process.env.TEST_FLAG = "disabled";
    expect(isFeatureEnabled("TEST_FLAG")).toBe(false);
  });
  it("should return false if featureFlag is undefined", () => {
    process.env.TEST_FLAG = undefined;
    expect(isFeatureEnabled("TEST_FLAG")).toBe(false);
  });
});
