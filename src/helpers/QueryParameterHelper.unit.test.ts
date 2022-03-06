import * as fc from "fast-check";

import { getParameterByName } from "./QueryParameterHelper";

describe("QueryParameterHelper", () => {
  const paramName = "p";

  function fixFcTestQueryParameterString(s: string): string {
    s = s.replace(/\+/g, "%2b");
    s = s.replace(/&/g, "%26");
    return s;
  }

  test("getParameterByName returns the right parameter value", () => {
    fc.assert(
      fc.property(fc.webQueryParameters({ size: "large" }), param => {
        param = fixFcTestQueryParameterString(param);
        const url = `?${paramName}=${param}&otherParameter=Olympus`;

        const returnParam = getParameterByName(paramName, url);

        return decodeURIComponent(param) === returnParam;
      }),
    );
  });
});
