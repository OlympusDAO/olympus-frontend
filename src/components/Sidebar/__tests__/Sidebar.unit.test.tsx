import Sidebar from "src/components/Sidebar/Sidebar";
import { render } from "src/testUtils";

describe("<Sidebar/>", () => {
  it("should render component", () => {
    const { container } = render(<Sidebar />);
    expect(container).toMatchSnapshot();
  });
});
