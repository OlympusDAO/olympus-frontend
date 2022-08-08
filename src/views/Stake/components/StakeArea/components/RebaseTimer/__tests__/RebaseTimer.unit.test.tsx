import { render } from "src/testUtils";
import RebaseTimer from "src/views/Stake/components/StakeArea/components/RebaseTimer/RebaseTimer";

describe("<RebaseTimer/>", () => {
  it("should render component", () => {
    const { container } = render(<RebaseTimer />);
    expect(container).toMatchSnapshot();
  });
});
