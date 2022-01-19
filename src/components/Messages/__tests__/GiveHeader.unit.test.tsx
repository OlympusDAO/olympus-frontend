import { render } from "../../../testUtils";
import Messages from "../Messages";

describe("<Messages/>", () => {
  it("should render component", () => {
    const { container } = render(<Messages />);
    expect(container).toMatchSnapshot();
  });
});
