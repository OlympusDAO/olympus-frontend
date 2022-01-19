import { render } from "../../../testUtils";
import CallToAction from "../CallToAction.jsx";

describe("<CallToAction/>", () => {
  it("should render component", () => {
    const { container } = render(<CallToAction setMigrationModalOpen />);
    expect(container).toMatchSnapshot();
  });
});
