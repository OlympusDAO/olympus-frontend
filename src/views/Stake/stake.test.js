import { render, screen, waitFor } from "../../test-utils";
import "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { getByTestId } from "@testing-library/dom";
import Stake from "./Stake.jsx";
import App from "../../App";

// We use msw to intercept the network request during the test
export const handlers = [
  rest.post("https://api.thegraph.com/subgraphs/name/drondin/olympus-graph", (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          _meta: {
            __typename: "_Meta_",
            block: {
              __typename: "_Block_",
              number: 13244419,
            },
          },
          protocolMetrics: [
            {
              __typename: "ProtocolMetric",
              marketCap: "888187675.8967761545440907819386178",
              nextDistributedOhm: "6419.305525833",
              nextEpochRebase: "0.3947563555820341142905131077418562",
              ohmCirculatingSupply: "1771844.544846037",
              ohmPrice: "501.278556564314452850829714320615",
              sOhmCirculatingSupply: "1626143.679528171",
              timestamp: "1631836836",
              totalSupply: "2169273.279359991",
              totalValueLocked: "815150956.4400647009708507987245194",
            },
          ],
        },
      }),
      // ctx.delay(150),
    );
  }),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

jest.setTimeout(10000);
test("the stake page APY, TVL, and Index", async () => {
  // we should probably just be rendering the <Stake /> component but we need to mock the store and api calls first (i think in the custom render function)
  // example of mocking store in render can be found here https://redux.js.org/usage/writing-tests
  render(<App />);
  expect(screen.getByTestId("staking-apy-loading")).toBeInTheDocument();
  expect(screen.getByTestId("staking-tvl-loading")).toBeInTheDocument();
  expect(screen.getByTestId("staking-index-loading")).toBeInTheDocument();
  await waitFor(
    () => {
      // we should check for the correct numbers being rendered here too
      expect(screen.getByTestId("staking-apy-value")).toBeInTheDocument();
      expect(screen.getByTestId("staking-tvl-value")).toBeInTheDocument();
      expect(screen.getByTestId("staking-index-value")).toBeInTheDocument();
    },
    { timeout: 10000 },
  );
});
