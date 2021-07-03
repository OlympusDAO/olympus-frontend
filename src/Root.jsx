/* eslint-disable global-require */
<<<<<<< HEAD
import { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
=======

<<<<<<< HEAD
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import configureStore from './store';
>>>>>>> commented out airbnb in eslint
=======
import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
>>>>>>> autoformat test

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
