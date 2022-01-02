/* eslint-disable global-require */
import { FC, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Web3ContextProvider } from "./hooks/web3Context";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { initLocale } from "./locales";

import App from "./App";
import store from "./store";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/react-query";
import { Web3ContextProvider as NewWeb3ContextProvider } from "./hooks/useWeb3Context";

const Root: FC = () => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <Web3ContextProvider>
      <NewWeb3ContextProvider>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <I18nProvider i18n={i18n}>
              <BrowserRouter basename={"/#"}>
                <App />
              </BrowserRouter>
            </I18nProvider>
          </Provider>
        </QueryClientProvider>
      </NewWeb3ContextProvider>
    </Web3ContextProvider>
  );
};

export default Root;
