import { render } from "../../../testUtils";
import Stake from "../Stake";
import { QueryClient, QueryClientProvider } from "react-query";
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
