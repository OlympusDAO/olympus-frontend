/* eslint-disable global-require */
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { StyledEngineProvider } from "@mui/material/styles";
import { FC, useEffect } from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

import App from "./App";
import { Web3ContextProvider } from "./hooks/web3Context";
import { ReactQueryProvider } from "./lib/react-query";
import { initLocale } from "./locales";
import store from "./store";

const Root: FC = () => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <Web3ContextProvider>
      <ReactQueryProvider>
        <Provider store={store}>
          <I18nProvider i18n={i18n}>
            <HashRouter>
              <StyledEngineProvider injectFirst>
                <App />
              </StyledEngineProvider>
            </HashRouter>
          </I18nProvider>
        </Provider>
      </ReactQueryProvider>
    </Web3ContextProvider>
  );
};

export default Root;
