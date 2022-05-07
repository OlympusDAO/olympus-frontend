import { render } from "../../../testUtils";
import MigrationModalSingle from "../MigrationModalSingle";

describe("<MigrationModalSingle/>", () => {
  it("should render component", () => {
    const { container } = render(<MigrationModalSingle open={false} handleClose={() => {}} />);
    expect(container).toMatchSnapshot();
  });
});
