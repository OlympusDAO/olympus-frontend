import { render, screen } from "src/testUtils";

import Bridge from "..";
describe("Bridge", () => {
  it("should render Bridge Screen with links", async () => {
    render(<Bridge />);
    expect(screen.getByText("Bridge on Wormhole")).toBeInTheDocument();
  });
});
