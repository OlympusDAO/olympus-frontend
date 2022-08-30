import MigrationModalSingle from "src/components/Migration/MigrationModalSingle";
import { render } from "src/testUtils";

describe("<MigrationModalSingle/>", () => {
  it("should render component", () => {
    const { container } = render(<MigrationModalSingle open={false} handleClose={() => console.log("handleClose")} />);
    expect(container).toMatchSnapshot();
  });
});
