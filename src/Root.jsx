/* eslint-disable global-require */
import { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { Web3ContextProvider } from "./hooks/web3Context";

import App from "./App";
import { store, persistor } from "./store";

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Web3ContextProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter basename={"/#"}>
              <App />
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </Web3ContextProvider>
    );
  }
}
