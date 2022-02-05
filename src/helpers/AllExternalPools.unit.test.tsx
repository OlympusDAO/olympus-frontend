import { allPools, fetchPoolData } from "src/helpers/AllExternalPools";

describe("Test AllExternalPools", () => {
  it("should return pool Data", async () => {
    const result = await fetchPoolData("", 5000.0);
    expect(result).toEqual(allPools);
  });
});
