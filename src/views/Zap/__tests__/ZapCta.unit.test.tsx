import { render } from "../../../testUtils";
import ZapCta from "../ZapCta";

describe("<ZapCta/>", () => {
  it("should render component", () => {
    const { container } = render(<ZapCta />);
    expect(container).toMatchSnapshot();
  });
});
