import RebaseTimer from "src/views/Stake/components/StakeArea/components/RebaseTimer/RebaseTimer";
import { describe, expect, it, test } from "vitest";

describe("<RebaseTimer/>", () => {
  test("should render component", () => {
    it("should render component", () => {
      const container = <RebaseTimer />;
      expect(container).toMatchSnapshot();
    });
  });
});
