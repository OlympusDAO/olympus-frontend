import { render, screen } from "src/testUtils";
import Stake from "src/views/Stake/Stake";
import { describe, expect, it } from "vitest";

describe("<Stake/>", () => {
  it("should render component", async () => {
    const { container } = render(<Stake />);
    expect(container).toMatchSnapshot();
  });

  it("should render correct staking headers", () => {
    const { container } = render(<Stake />);
    // there should be a header inviting user to Stake
    expect(screen.getAllByText("Stake")[0]);
    expect(container).toMatchSnapshot();
  });
});
