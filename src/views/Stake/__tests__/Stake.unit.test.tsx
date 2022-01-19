import { QueryClient, QueryClientProvider } from "react-query";

import { render } from "../../../testUtils";
import Stake from "../Stake";
const queryClient = new QueryClient();

describe("<Stake/>", () => {
  it("should render component", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Stake />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
