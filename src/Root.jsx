/* eslint-disable global-require */
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

import React, { Component } from "react";
=======
=======
>>>>>>> commented out airbnb in eslint
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
import { Component } from "react";
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import configureStore from "./store";

export default class Root extends Component {
  store;

  constructor(props) {
    super(props);
    this.store = configureStore({});
  }

  render() {
    return (
      <Provider store={this.store}>
        <BrowserRouter basename={"/#"}>
          <App />
        </BrowserRouter>
      </Provider>
    );
  }
}
