/* eslint-disable global-require */
import { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Web3ContextProvider } from "./hooks/web3Context";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { messages } from "./locales/en/messages";

import App from "./App";
import store from "./store";

i18n.load("en", messages);
i18n.activate("en");

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
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
}
