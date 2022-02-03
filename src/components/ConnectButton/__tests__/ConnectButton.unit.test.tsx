import { render } from "../../../testUtils";
import ConnectButton from "../ConnectButton";

describe("<ConnectButton/>", () => {
  it("should render component", () => {
    const { container } = render(<ConnectButton />);
    expect(container).toMatchSnapshot();
  });
});
