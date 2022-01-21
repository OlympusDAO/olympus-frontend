import { allPools, fetchPoolData } from "src/helpers/AllExternalPools";

describe("Test AllExternPools", () => {
  it("should return immediately if user address is unknown", async () => {
    const result = await fetchPoolData("");
    expect(result).toEqual(allPools);
  });
});
