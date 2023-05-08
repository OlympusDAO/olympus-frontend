import { createMatchMedia } from "src/testHelpers";
import { render } from "src/testUtils";
import TreasuryDashboard from "src/views/TreasuryDashboard/TreasuryDashboard";
import { beforeAll, describe, expect, it, test } from "vitest";

beforeAll(() => {
  window.matchMedia = createMatchMedia("300px");
});

describe("<TreasuryDashboard/> Mobile", () => {
  test("should render component", () => {
    it("should render component", () => {
      const { container } = render(<TreasuryDashboard />);
      expect(container).toMatchSnapshot();
    });
  });
});
