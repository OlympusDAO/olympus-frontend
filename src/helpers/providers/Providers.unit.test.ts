import { NetworkId } from "src/networkDetails";

import { Providers } from "./providers";

describe("Providers", () => {
  it("has a provider url for every network", () => {
    // see this for details on the TypeScript obnoxious enum implementation
    // https://www.cloudhadoop.com/typescript-enum-iterate/
    // It will explain the ugly code below that simply tries to iterate all enum values.
    Object.values(NetworkId)
      .filter(networkId => +networkId !== NetworkId.Localhost && !isNaN(+networkId))
      .forEach(networkId => {
        console.debug({ networkId });
        expect(Providers.getProviderUrl(+networkId as unknown as NetworkId)).toBeTruthy();
      });
  });
});
