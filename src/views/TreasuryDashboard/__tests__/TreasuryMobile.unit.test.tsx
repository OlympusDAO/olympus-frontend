import { Environment } from "src/helpers/environment/Environment/Environment";
import { createMatchMedia } from "src/testHelpers";
import { render, screen } from "src/testUtils";

import TreasuryDashboard from "../TreasuryDashboard";

beforeAll(() => {
  window.matchMedia = createMatchMedia("300px");
});

describe("<TreasuryDashboard/> Mobile", () => {
  it("should render component", () => {
    const { container } = render(<TreasuryDashboard />);
    expect(container).toMatchSnapshot();
  });

  it("should render Metrics Dashboard only when Multifarm is disabled", () => {
    Environment.isMultifarmDashboardEnabled = jest.fn().mockReturnValue(undefined);
    expect(screen.queryByText("Revenue")).not.toBeInTheDocument(); //This is a string that is part of the tabs component
  });
});
