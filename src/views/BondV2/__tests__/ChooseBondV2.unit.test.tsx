import { ReactQueryProvider } from "src/lib/react-query";

import { render } from "../../../testUtils";
import ChooseBondV2 from "../ChooseBondV2";

describe("<ChooseBondV2/>", () => {
  it("should render component", () => {
    const { container } = render(
      <ReactQueryProvider>
        <ChooseBondV2 />
      </ReactQueryProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
