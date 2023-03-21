import { render } from "src/testUtils";
import TreasuryDashboard from "src/views/TreasuryDashboard/TreasuryDashboard";
import { describe, expect, it, test } from "vitest";

describe("<TreasuryDashboard/>", () => {
  test("should render component", () => {
    it("should render component", () => {
      const { container } = render(<TreasuryDashboard />);
      expect(container).toMatchSnapshot();
    });
  });
});
