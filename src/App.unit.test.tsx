import { renderRoute, screen } from "./testUtils";

describe("<App/>", () => {
  test("renders without crashing", () => {
    renderRoute("/");
    expect(screen.getByText("Connect your wallet to stake OHM")).toBeInTheDocument();
  });
});
