import { QueryClient, QueryClientProvider } from "react-query";

import { render } from "../../../testUtils";
import TreasuryDashboard from "../TreasuryDashboard";

describe("<TreasuryDashboard/>", () => {
  const queryClient = new QueryClient();
  it("should render component", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <TreasuryDashboard />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
