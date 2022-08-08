import { render } from "src/testUtils";
import TreasuryDashboard from "src/views/TreasuryDashboard/TreasuryDashboard";

describe("<TreasuryDashboard/>", () => {
  it("should render component", () => {
    const { container } = render(<TreasuryDashboard />);
    expect(container).toMatchSnapshot();
  });
});
