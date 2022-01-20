import { render } from "../../../testUtils";
import Wrap from "../Wrap.jsx";

describe("<Zap/>", () => {
  it("should render component", () => {
    const { container } = render(<Wrap />);
    expect(container).toMatchSnapshot();
  });
});
