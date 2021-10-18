import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { light as lightTheme } from "../../src/themes/light.js";
import { Web3ContextProvider } from "../../src/hooks/web3Context";
import store from "../../src/store.ts";
import { setupServer } from "msw/node";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import App from "../../src/App";
import handlers from "./handlers";

const AllTheProviders = ({ children }) => {
  return (
    <Web3ContextProvider>
      <Provider store={store}>
        <BrowserRouter basename={"/"}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </Web3ContextProvider>
  );
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

const renderRoute = function (route) {
  const history = createMemoryHistory();
  history.push(route);
  render(
    <Web3ContextProvider>
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={lightTheme}>
            <App />
          </ThemeProvider>
        </Router>
      </Provider>
    </Web3ContextProvider>,
  );
};
const setup = function () {
  const server = setupServer(...handlers);

  // Enable API mocking before tests.
  beforeAll(() => server.listen());

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers());

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  jest.setTimeout(20000);
};
// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render, renderRoute, setup };
