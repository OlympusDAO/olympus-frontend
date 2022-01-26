import { render } from "../../../testUtils";
import WrapCrossChain from "../WrapCrossChain";

describe("<WrapCrossChain/>", () => {
  it("should render component", () => {
    const { container } = render(<WrapCrossChain />);
    expect(container).toMatchSnapshot();
  });
});
