import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import configureStore from "./store";

import { Web3ContextProvider } from "./hooks/Web3Context";

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.store = configureStore({});
  }

  render() {
    return (
      <Provider store={this.store}>
        <BrowserRouter basename="/#">
          <Web3ContextProvider>
            <App />
          </Web3ContextProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}
