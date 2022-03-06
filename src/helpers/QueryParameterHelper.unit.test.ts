import * as fc from "fast-check";

import { getParameterByName } from "./QueryParameterHelper";

function fixFcTestQueryParameterString(s: string): string {
  s = s.replace("+", "%2b");
  s = s.replace("&", "%26");
  return s;
}

describe("QueryParameterHelper", () => {
  const paramName = "p";

  test("getBondCalculator always returns contract with the correct contract address", () => {
    fc.assert(
      fc.property(fc.webQueryParameters({ size: "small" }), param => {
        param = fixFcTestQueryParameterString(param);
        const url = `?${paramName}=${param}`;

        const returnParam = getParameterByName(paramName, url);

        return decodeURIComponent(param) === returnParam;
      }),
    );
  });
});
