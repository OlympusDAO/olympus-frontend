import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { light as lightTheme } from "./themes/light.js";
import { Web3ContextProvider } from "./hooks/web3Context";
import store from "./store.ts";
import { createMemoryHistory } from "history";
import App from "./App";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

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
