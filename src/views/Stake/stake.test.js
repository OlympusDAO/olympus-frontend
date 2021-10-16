import { render, screen, waitFor } from "../../../test-utils";
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
              number: 13404804,
            },
          },
          protocolMetrics: [
            {
              __typename: "ProtocolMetric",
              marketCap: "2850404741.408880328568714963827889",
              nextDistributedOhm: "9536.348673867",
              nextEpochRebase: "0.3984399885022833379898967937151319",
              ohmCirculatingSupply: "2606164.580244948",
              ohmPrice: "1093.716322835212771836103791185812",
              sOhmCirculatingSupply: "2393421.581431541",
              timestamp: "1633996882",
              totalSupply: "3217915.76256185",
              totalValueLocked: "2617724251.037744790511990363550964",
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

jest.setTimeout(60000);
test("the stake page APY, TVL, and Index", async () => {
  // we should probably just be rendering the <Stake /> component
  render(<App />);
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
