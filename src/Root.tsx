/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import configureStore from './store';

type Props = {
  data: {
    app: { };
  };
};

export default class Root extends Component<Props> {
  store: any;

  constructor(props: any) {
    super(props);
    this.store = configureStore({});
  }

  render() {
    return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  }
}
