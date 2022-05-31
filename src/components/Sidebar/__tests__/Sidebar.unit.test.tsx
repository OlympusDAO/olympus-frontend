import { render } from "../../../testUtils";
import Sidebar from "../Sidebar";

describe("<Sidebar/>", () => {
  it("should render component", () => {
    const { container } = render(<Sidebar />);
    expect(container).toMatchSnapshot();
  });
});
