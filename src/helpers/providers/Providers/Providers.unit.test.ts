import { Providers } from "src/helpers/providers/Providers/Providers";
import { enumToArray } from "src/helpers/types/enumToArray";
import { NetworkId } from "src/networkDetails";

describe("Providers", () => {
  it("has a provider url for every network", () => {
    enumToArray(NetworkId).forEach(networkId => {
      expect(Providers.getProviderUrl(networkId as NetworkId)).toBeTruthy();
    });
  });
});
