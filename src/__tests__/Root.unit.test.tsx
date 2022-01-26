import Root from "../Root";
import { render } from "../testUtils";

describe("<Root/>", () => {
  it("should render component", () => {
    const { container } = render(<Root />);
    expect(container).toMatchSnapshot();
  });
});
