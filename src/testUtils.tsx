import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React, { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

import App from "./App";
import { Web3ContextProvider } from "./hooks/web3Context";
import { ReactQueryProvider } from "./lib/react-query";
import defaultStore from "./store";
import { light as lightTheme } from "./themes/light.js";

const customRender = (ui: ReactElement, store = defaultStore, options?: RenderOptions): RenderResult => {
  const ProviderWrapper = ({ children }: { children?: ReactNode }) => (
    <Web3ContextProvider>
      <ReactQueryProvider>
        <Provider store={store}>
          <I18nProvider i18n={i18n}>
            <HashRouter>
              <StyledEngineProvider injectFirst>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  {children}
                </ThemeProvider>
              </StyledEngineProvider>
            </HashRouter>
          </I18nProvider>
        </Provider>
      </ReactQueryProvider>
    </Web3ContextProvider>
  );
  return render(ui, { wrapper: ProviderWrapper, ...options });
};

const renderRoute = function (route: string, store = defaultStore) {
  const history = createMemoryHistory();
  history.push(route);
  return render(
    <Web3ContextProvider>
      <ReactQueryProvider>
        <Provider store={store}>
          <I18nProvider i18n={i18n}>
            <HashRouter>
              <StyledEngineProvider injectFirst>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <App />
                </ThemeProvider>
              </StyledEngineProvider>
            </HashRouter>
          </I18nProvider>
        </Provider>
      </ReactQueryProvider>
    </Web3ContextProvider>,
  );
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render, renderRoute };
