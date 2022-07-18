import { render } from "src/testUtils";

import TreasuryDashboard from "../TreasuryDashboard";

describe("<TreasuryDashboard/>", () => {
  it("should render component", () => {
    const { container } = render(<TreasuryDashboard />);
    expect(container).toMatchSnapshot();
  });
});
