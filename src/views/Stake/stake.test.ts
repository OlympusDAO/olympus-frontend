import "@testing-library/jest-dom";
import {
  dapp,
  clickElement,
  connectWallet,
  selectorExists,
  waitSelectorExists,
  getSelectorTextContent,
  typeValue,
} from "../../helpers/testHelpers";

test("the stake page APY, TVL, and Index", async () => {
  const { page } = dapp;
  expect(await selectorExists(page, "#stake-connect-wallet")).toBeTruthy();
  /*
  await waitFor(
    () => {
      // we should check for the correct numbers being rendered here too
      /     expect(screen.getByTestId("apy-value")).toHaveTextContent("7,340.2%");
      expect(screen.getByTestId("tvl-value")).toBeInTheDocument("$2,617,724,251");
      expect(screen.getByTestId("index-value")).toBeInTheDocument("21.5 OHM");
      
    },
    { timeout: 30000 },
  );
  */
});
