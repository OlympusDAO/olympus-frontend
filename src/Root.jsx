/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import configureStore from './store';


export default class Root extends Component {
  store ;

  constructor(props ) {
    super(props);
    this.store = configureStore({});
  }

  render() {
    return (
      <Provider store={this.store}>
        <BrowserRouter basename={'/#'}>
          <App />
        </BrowserRouter>
      </Provider>
    );
  }
}
