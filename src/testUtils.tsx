import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React, { ReactElement, ReactNode } from "react";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { Web3ContextProvider } from "./hooks/web3Context";
import { queryClient } from "./lib/react-query";
import store from "./store";
import { light as lightTheme } from "./themes/light.js";

const ProviderWrapper = ({ children }: { children?: ReactNode }) => (
  <Web3ContextProvider>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <I18nProvider i18n={i18n}>
          <BrowserRouter basename={"/#"}>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </BrowserRouter>
        </I18nProvider>
      </Provider>
    </QueryClientProvider>
  </Web3ContextProvider>
);

const customRender = (ui: ReactElement, options?: RenderOptions): RenderResult =>
  render(ui, { wrapper: ProviderWrapper, ...options });

const renderRoute = function (route: string) {
  const history = createMemoryHistory();
  history.push(route);
  render(
    <Web3ContextProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <I18nProvider i18n={i18n}>
            <BrowserRouter basename={"/#"}>
              <App />
            </BrowserRouter>
          </I18nProvider>
        </Provider>
      </QueryClientProvider>
    </Web3ContextProvider>,
  );
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render, renderRoute };
