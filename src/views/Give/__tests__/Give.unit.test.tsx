import { render } from "../../../testUtils";
import Give from "../Give";

describe("<Give/>", () => {
  it("should render component", () => {
    const { container } = render(<Give />);
    expect(container).toMatchSnapshot();
  });
});
