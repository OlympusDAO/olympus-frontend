import { renderRoute, setup, screen, waitFor } from "../../../tests/unit/utils";
import "@testing-library/jest-dom";

setup();

test("the bond treasury balance and OHM price", async () => {
  renderRoute("/bonds");
  expect(screen.getByTestId("treasury-balance-loading")).toBeInTheDocument();
  await waitFor(
    () => {
      expect(screen.getByTestId("treasury-balance")).toHaveTextContent("toto");
    },
    { timeout: 10000 },
  );
});
