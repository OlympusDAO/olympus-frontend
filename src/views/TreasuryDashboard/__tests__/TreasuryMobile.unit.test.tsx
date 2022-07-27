import { createMatchMedia } from "src/testHelpers";

import { render } from "../../../testUtils";
import TreasuryDashboard from "../TreasuryDashboard";

beforeAll(() => {
  window.matchMedia = createMatchMedia("300px");
});

describe("<TreasuryDashboard/> Mobile", () => {
  it("should render component", () => {
    const { container } = render(<TreasuryDashboard />);
    expect(container).toMatchSnapshot();
  });
});
