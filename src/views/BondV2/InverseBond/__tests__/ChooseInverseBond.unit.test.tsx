import { ReactQueryProvider } from "src/lib/react-query";
import { render } from "src/testUtils";

import ChooseInverseBond from "../ChooseInverseBond";

describe("<ChooseInverseBond/>", () => {
  it("should render component", () => {
    const { container } = render(
      <ReactQueryProvider>
        <ChooseInverseBond />
      </ReactQueryProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
