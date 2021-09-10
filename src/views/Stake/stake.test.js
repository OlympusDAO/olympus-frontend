import { render, screen, waitFor } from "../../test-utils";
import "@testing-library/jest-dom";
import Stake from "./Stake.jsx";
import App from "../../App";
import { getByTestId } from "@testing-library/dom";

// remove this timeout over ride when store and api calls are mocked
jest.setTimeout(30000);
test("the stake page APY, TVL, and Index", async () => {
  // we should probably just be rendering the <Stake /> component but we need to mock the store and api calls first (i think in the custom render function)
  // example of mocking store in render can be found here https://redux.js.org/usage/writing-tests
  const { container, getByText } = render(<App />);
  expect(getByText("APY")).toBeInTheDocument();
  expect(screen.getByTestId("staking-apy-loading")).toBeInTheDocument();
  await waitFor(
    () => {
      expect(screen.getByTestId("staking-apy-value")).toBeInTheDocument();
    },
    { timeout: 20000 },
  );
});
