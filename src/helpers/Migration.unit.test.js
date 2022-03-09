import * as fc from "fast-check";

import { formatCurrency } from "./Migration";

test("formatCurrency always returns value starting with $", async () => {
  fc.assert(
    fc.property(fc.float({ min: 0.1 }), value => {
      const formatted = formatCurrency(value);
      expect(formatted).toStartWith("$");
    }),
  );
});

test("formatCurrency splits thousands with comma", async () => {
  fc.assert(
    fc.property(fc.float({ min: 1000, max: 999999 }), value => {
      const formatted = formatCurrency(value);
      expect(formatted).toContain(",");
      const chunks = formatted.split(",");
      expect(chunks.length).toEqual(2);
    }),
  );
});

test("formatCurrency trims cents", async () => {
  fc.assert(
    fc.property(fc.float({ min: 1.01, max: 1.999 }), value => {
      const formatted = formatCurrency(value);
      expect(formatted).not.toContain(".");
    }),
  );
});
