import { render, screen } from "src/testUtils";
import Stake from "src/views/Stake/Stake";
import { describe, expect, it, test } from "vitest";

describe("<Stake/>", () => {
  test("should render component", () => {
    it("should render component", async () => {
      const { container } = render(<Stake />);
      expect(container).toMatchSnapshot();
    });
  });

  test("should render correct staking headers", () => {
    it("should render correct staking headers", () => {
      const { container } = render(<Stake />);
      // there should be a header inviting user to Stake
      expect(screen.getAllByText("Stake")[0]);
      //  there should be a Farm Pool table

      expect(screen.getByText("Farm Pool"));
      expect(container).toMatchSnapshot();
    });
  });
});
