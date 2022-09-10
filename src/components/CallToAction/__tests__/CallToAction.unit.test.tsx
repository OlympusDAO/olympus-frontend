import React from "react";
import CallToAction from "src/components/CallToAction/CallToAction";
//import { render } from "src/testUtils";
import { describe, expect, it } from "vitest";

describe("<CallToAction/>", () => {
  it("should render component", () => {
    const container = <CallToAction setMigrationModalOpen={() => console.log("setMigrationModalOpen")} />;
    expect(container).toMatchSnapshot();
  });
});
