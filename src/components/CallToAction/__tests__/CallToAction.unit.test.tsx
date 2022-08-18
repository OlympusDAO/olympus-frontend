import CallToAction from "src/components/CallToAction/CallToAction";
import { render } from "src/testUtils";

describe("<CallToAction/>", () => {
  it("should render component", () => {
    const { container } = render(<CallToAction setMigrationModalOpen={() => console.log("setMigrationModalOpen")} />);
    expect(container).toMatchSnapshot();
  });
});
