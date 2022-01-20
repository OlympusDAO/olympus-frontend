import { render } from "../../../testUtils";
import Zap from "../Zap.jsx";

describe("<Zap/>", () => {
  it("should render component", () => {
    const { container } = render(<Zap />);
    expect(container).toMatchSnapshot();
  });
});
