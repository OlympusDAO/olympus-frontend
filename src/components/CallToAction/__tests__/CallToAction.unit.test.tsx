import { render } from "../../../testUtils";
import CallToAction from "../CallToAction";

describe("<CallToAction/>", () => {
  it("should render component", () => {
    const { container } = render(<CallToAction setMigrationModalOpen />);
    expect(container).toMatchSnapshot();
  });
});
