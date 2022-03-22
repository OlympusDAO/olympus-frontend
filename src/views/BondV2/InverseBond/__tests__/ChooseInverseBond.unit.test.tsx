import { QueryClient, QueryClientProvider } from "react-query";
import { render } from "src/testUtils";

import ChooseInverseBond from "../ChooseInverseBond";
const queryClient = new QueryClient();

describe("<ChooseInverseBond/>", () => {
  it("should render component", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ChooseInverseBond />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
