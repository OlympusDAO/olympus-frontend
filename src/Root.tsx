/* eslint-disable global-require */
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { FC, useEffect } from "react";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { Web3ContextProvider } from "./hooks/web3Context";
import { queryClient } from "./lib/react-query";
import { initLocale } from "./locales";
import store from "./store";

const Root: FC = () => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
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
    </Web3ContextProvider>
  );
};

export default Root;
