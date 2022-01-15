import { render } from "../../../testUtils";
import Announcement from "../Announcement.jsx";

describe("<Announcement/>", () => {
  it("should render component", () => {
    const { container } = render(<Announcement />);
    expect(container).toMatchSnapshot();
  });
});
