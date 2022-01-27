import { render } from "../../../testUtils";
import NotFound from "../NotFound";

describe("<NotFound/>", () => {
  it("should render component", () => {
    const { container } = render(<NotFound />);
    expect(container).toMatchSnapshot();
  });
});
