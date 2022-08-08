import { render } from "src/testUtils";
import NotFound from "src/views/404/NotFound";

describe("<NotFound/>", () => {
  it("should render component", () => {
    const { container } = render(<NotFound />);
    expect(container).toMatchSnapshot();
  });
});
