import React from "react";
import CallToAction from "src/components/CallToAction/CallToAction";
import { render } from "src/testUtils";
//import { render } from "src/testUtils";
import { describe, expect, it, test } from "vitest";

describe("<CallToAction/>", () => {
  test("should render component", () => {
    it("should render component", () => {
      const container = render(<CallToAction setMigrationModalOpen={() => console.log("setMigrationModalOpen")} />);
      expect(container).toMatchSnapshot();
    });
  });
});
