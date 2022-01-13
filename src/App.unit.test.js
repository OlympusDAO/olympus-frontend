import { render, renderRoute, screen } from "./testUtils";

// eslint-disable-next-line no-undef
test("renders learn react link", () => {
  expect(true).toBe(true);
});

test("renders without crashing", () => {
  renderRoute("/");
  expect(screen.getByText("Connect your wallet to stake OHM")).toBeInTheDocument();
});
