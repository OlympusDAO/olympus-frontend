/* eslint-disable global-require */
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { StyledEngineProvider, Theme, ThemeProvider } from "@mui/material/styles";
import { FC, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { Web3ContextProvider } from "./hooks/web3Context";
import { ReactQueryProvider } from "./lib/react-query";
import { initLocale } from "./locales";
import store from "./store";
import { dark as darkTheme } from "./themes/dark.js";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const Root: FC = () => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <Web3ContextProvider>
      <ReactQueryProvider>
        <Provider store={store}>
          <I18nProvider i18n={i18n}>
            <BrowserRouter basename={"/#"}>
              <StyledEngineProvider injectFirst>
                <ThemeProvider theme={darkTheme}>
                  <App />
                </ThemeProvider>
              </StyledEngineProvider>
            </BrowserRouter>
          </I18nProvider>
        </Provider>
      </ReactQueryProvider>
    </Web3ContextProvider>
  );
};

export default Root;
