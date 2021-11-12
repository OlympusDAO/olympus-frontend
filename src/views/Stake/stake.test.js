import { renderRoute, screen, waitFor, setup } from "../../../tests/unit/utils";
import "@testing-library/jest-dom";
import { getByTestId } from "@testing-library/dom";

setup();
test("the stake page APY, TVL, and Index", async () => {
  renderRoute("/stake");
  expect(screen.getByTestId("apy-loading")).toBeInTheDocument();
  expect(screen.getByTestId("tvl-loading")).toBeInTheDocument();
  expect(screen.getByTestId("index-loading")).toBeInTheDocument();
  await waitFor(
    () => {
      // we should check for the correct numbers being rendered here too
      expect(screen.getByTestId("apy-value")).toHaveTextContent("7,340.2%");
      expect(screen.getByTestId("tvl-value")).toBeInTheDocument("$2,617,724,251");
      expect(screen.getByTestId("index-value")).toBeInTheDocument("21.5 OHM");
    },
    { timeout: 30000 },
  );
});
