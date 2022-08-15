import { createMatchMedia } from "src/testHelpers";
import { render } from "src/testUtils";
import TreasuryDashboard from "src/views/TreasuryDashboard/TreasuryDashboard";

beforeAll(() => {
  window.matchMedia = createMatchMedia("300px");
});

describe("<TreasuryDashboard/> Mobile", () => {
  it("should render component", () => {
    const { container } = render(<TreasuryDashboard />);
    expect(container).toMatchSnapshot();
  });
});
