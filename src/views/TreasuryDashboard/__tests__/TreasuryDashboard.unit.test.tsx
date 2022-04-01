import { ReactQueryProvider } from "src/lib/react-query";

import { render } from "../../../testUtils";
import TreasuryDashboard from "../TreasuryDashboard";

describe("<TreasuryDashboard/>", () => {
  it("should render component", () => {
    const { container } = render(
      <ReactQueryProvider>
        <TreasuryDashboard />
      </ReactQueryProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
