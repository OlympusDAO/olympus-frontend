import { render } from "../../../testUtils";
import CardHeader from "../CardHeader";

describe("<CardHeader/>", () => {
  it("should render component", () => {
    const { container } = render(<CardHeader title="Card Header Title" />);
    expect(container).toMatchSnapshot();
  });
});
