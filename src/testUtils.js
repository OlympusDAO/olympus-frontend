import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { Web3ContextProvider } from "./hooks/web3Context";
import store from "./store.ts";
import { light as lightTheme } from "./themes/light.js";

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
        <I18nProvider i18n={i18n}>
          <BrowserRouter basename={"/#"}>
            <App />
          </BrowserRouter>
        </I18nProvider>
      </Provider>
    </Web3ContextProvider>,
  );
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render, renderRoute };
