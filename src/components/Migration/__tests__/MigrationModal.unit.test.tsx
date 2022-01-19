import { render } from "../../../testUtils";
import MigrationModal from "../MigrationModal";

describe("<MigrationModal/>", () => {
  it("should render component", () => {
    const { container } = render(<MigrationModal open={false} handleClose={() => console.log("handleClose")} />);
    expect(container).toMatchSnapshot();
  });
});
