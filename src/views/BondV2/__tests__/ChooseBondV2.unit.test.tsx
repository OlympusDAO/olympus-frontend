import { QueryClient, QueryClientProvider } from "react-query";

import { render } from "../../../testUtils";
import ChooseBondV2 from "../ChooseBondV2";
const queryClient = new QueryClient();

describe("<ChooseBondV2/>", () => {
  it("should render component", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ChooseBondV2 />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
