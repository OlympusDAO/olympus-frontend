import { render } from "../../../testUtils";
import Wrap from "../Wrap";

describe("<Wrap/>", () => {
  it("should render component", () => {
    const { container } = render(<Wrap />);
    expect(container).toMatchSnapshot();
  });
});
