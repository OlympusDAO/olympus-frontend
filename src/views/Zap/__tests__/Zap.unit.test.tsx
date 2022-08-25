import { render } from "src/testUtils";
import Zap from "src/views/Zap/Zap";

describe("<Zap/>", () => {
  it("should render component", () => {
    const { container } = render(<Zap />);
    expect(container).toMatchSnapshot();
  });
});
