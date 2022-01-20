import { render } from "../../../testUtils";
import CardHeader from "../CardHeader.jsx";

describe("<CardHeader/>", () => {
  it("should render component", () => {
    const { container } = render(<CardHeader title={"Test"} />);
    expect(container).toMatchSnapshot();
  });
});
