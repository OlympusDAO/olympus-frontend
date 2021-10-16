import { renderRoute, setup, screen, waitFor } from "../../../tests/unit/utils";
import "@testing-library/jest-dom";
import { getByTestId } from "@testing-library/dom";

setup();

test("the bond treasury balance and OHM price", async () => {
  renderRoute("/bonds");
  expect(screen.getByTestId("treasury-balance")).toBeInTheDocument();
  /*
  await waitFor(
    () => {
      // we should check for the correct numbers being rendered here too
      expect(screen.getByTestId("treasury-balance")).toBeInTheDocument();
    },
    { timeout: 30000 },
  );*/
});
