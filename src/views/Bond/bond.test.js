import { render, screen, waitFor } from "../../../tests/unit/utils";
import handlers from "../../../tests/unit/handlers";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { getByTestId } from "@testing-library/dom";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import App from "../../App";

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

jest.setTimeout(10000);
test("the bond treasury balance and OHM price", async () => {
  // we should probably just be rendering the <Bond /> component
  const history = createMemoryHistory();
  const route = "/bonds";
  history.push(route);
  render(
    <Router history={history}>
      <App />
    </Router>,
  );
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
