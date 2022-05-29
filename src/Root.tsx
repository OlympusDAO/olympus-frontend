/* eslint-disable global-require */
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { StyledEngineProvider } from "@mui/material/styles";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { FC, useEffect } from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { WagmiConfig } from "wagmi";

import App from "./App";
import { chains, wagmiClient } from "./hooks/wagmi";
import { ReactQueryProvider } from "./lib/react-query";
import { initLocale } from "./locales";
import store from "./store";

const Root: FC = () => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
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
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Root;
