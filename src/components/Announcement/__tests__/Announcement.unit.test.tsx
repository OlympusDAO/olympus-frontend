import { render } from "../../../testUtils";
import Announcement from "../Announcement.jsx";

describe("<Announcement/>", () => {
  it("should render component", () => {
    const { container } = render(<Announcement />);
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent(
      "Treasury stats may be inaccurate during the migration. Please check discord if you have any questions.",
    );
  });
});
