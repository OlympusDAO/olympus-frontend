import { render, screen } from "src/testUtils";
import { describe, expect, it } from "vitest";

import Bridge from "..";
describe("Bridge", () => {
  it("should render", async () => {
    render(<Bridge />);
    expect(screen.queryByText("Bridge"));
  });
});
