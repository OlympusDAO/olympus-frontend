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
      expect(screen.getByTestId("apy-value")).toBeInTheDocument();
      expect(screen.getByTestId("tvl-value")).toBeInTheDocument();
      expect(screen.getByTestId("index-value")).toBeInTheDocument();
    },
    { timeout: 30000 },
  );
});
