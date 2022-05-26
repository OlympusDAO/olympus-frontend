import { render, screen } from "../../../testUtils";
import Sidebar from "../Sidebar";

describe("<Sidebar/>", () => {
  it("should Display Sidebar with Nav Items", () => {
    render(<Sidebar />);
    expect(screen.getByText("Dashboard"));
  });
});
