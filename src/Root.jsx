import { i18n } from "@lingui/core";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { I18nProvider } from "@lingui/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import store from "./store";
import { initLocale } from "./locales";
import { Web3ContextProvider } from "./hooks/web3Context";

function Root() {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <Web3ContextProvider>
      <Provider store={store}>
        <I18nProvider i18n={i18n}>
          <BrowserRouter basename={"/#"}>
            <App />
          </BrowserRouter>
        </I18nProvider>
      </Provider>
    </Web3ContextProvider>
  );
}

export default Root;
