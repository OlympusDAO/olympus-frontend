import { render } from "../../../testUtils";
import RebaseTimer from "../RebaseTimer";

describe("<Messages/>", () => {
  it("should render component", () => {
    const { container } = render(<RebaseTimer />);
    expect(container).toMatchSnapshot();
  });
});
