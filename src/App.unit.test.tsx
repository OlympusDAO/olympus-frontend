import { renderRoute, screen } from "./testUtils";

describe("<App/>", () => {
  it("renders without crashing", () => {
    renderRoute("/");
    expect(screen.getByText("Connect your wallet to stake OHM")).toBeInTheDocument();
  });
});
