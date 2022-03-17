import { StaticJsonRpcProvider } from "@ethersproject/providers";
import * as fc from "fast-check";
import { toInteger } from "lodash";

import { addresses } from "../networkDetails";
import { getBondCalculator } from "./BondCalculator";

describe("BondCalculator", () => {
  test("getBondCalculator always returns contract with the correct contract address", () => {
    const networkNames = Object.keys(addresses).map(key => toInteger(key)) as number[];
    const provider = null as unknown as StaticJsonRpcProvider;

    fc.assert(
      fc.property(fc.subarray(networkNames, { minLength: 1, maxLength: 1 }), fc.boolean(), (networkIds, isV2Bond) => {
        const networkId = networkIds[0];

        const expectedContractAddress = isV2Bond
          ? addresses[networkId].BONDINGCALC_V2
          : addresses[networkId].BONDINGCALC_ADDRESS;

        const shouldSkipTest = expectedContractAddress === undefined || expectedContractAddress === "";
        if (shouldSkipTest) {
          return true;
        }

        const contract = getBondCalculator(networkId, provider, isV2Bond);
        return contract.address === expectedContractAddress;
      }),
    );
  });
});
