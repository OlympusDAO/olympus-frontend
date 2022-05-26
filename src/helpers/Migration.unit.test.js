import * as fc from "fast-check";

import { formatCurrency } from "./Migration";

test("formatCurrency always returns value starting with $", async () => {
  // force 0.1 to a 32-bit float
  const min32 = new Float32Array([0.1])[0];
  fc.assert(
    fc.property(fc.float({ min: min32 }), value => {
      const formatted = formatCurrency(value);

      console.log("formatted", value, formatted);
      expect(formatted).toStartWith("$");
    }),
  );
});

test("formatCurrency splits thousands with comma", async () => {
  fc.assert(
    fc.property(fc.integer({ min: 1000, max: 999999 }), value => {
      const formatted = formatCurrency(value);
      expect(formatted).toContain(",");
      const chunks = formatted.split(",");
      expect(chunks.length).toEqual(2);
    }),
  );
});

test("formatCurrency trims cents", async () => {
  // force 1.01 to a 32-bit float
  const float32 = new Float32Array([1.01])[0];
  const max32 = new Float32Array([1.999])[0];
  fc.assert(
    fc.property(fc.float({ min: float32, max: max32 }), value => {
      const formatted = formatCurrency(value);
      expect(formatted).not.toContain(".");
    }),
  );
});
