import { NetworkId } from "src/networkDetails";

import { Providers } from "./providers";

describe("Providers", () => {
  it("has a provider url for every network", () => {
    Object.keys(NetworkId).forEach(networkId => {
      expect(Providers.getProviderUrl(networkId as unknown as NetworkId)).toBeTruthy();
    });
  });
});
