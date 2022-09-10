import React from "react";
import RebaseTimer from "src/views/Stake/components/StakeArea/components/RebaseTimer/RebaseTimer";
import { describe, expect, it } from "vitest";

describe("<RebaseTimer/>", () => {
  it("should render component", () => {
    const container = <RebaseTimer />;
    expect(container).toMatchSnapshot();
  });
});
