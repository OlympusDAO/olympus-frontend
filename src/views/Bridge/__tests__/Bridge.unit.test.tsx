import { fireEvent } from "@testing-library/dom";
import { render, screen } from "src/testUtils";

import Bridge from "..";
describe("Bridge", () => {
  it("should render Bridge Screen with links", async () => {
    render(<Bridge />);
    expect(screen.getByText("Fantom")).toBeInTheDocument();
  });

  it("should dismiss banner when clicked", async () => {
    render(<Bridge />);
    fireEvent.click(screen.getByTestId("dismiss"));
    expect(screen.queryByText("Use your gOHM on your favorite chain.")).not.toBeInTheDocument();
  });
});
