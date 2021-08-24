/* eslint-disable global-require */
import { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Web3ContextProvider } from "./hooks/web3Context";

import App from "./App";
import store from "./store";

// Google Analytics
import ReactGA from "react-ga4";
const TRACKING_ID = "G-TKEFGWGLPM";
ReactGA.initialize(TRACKING_ID);
//
// Initialize google analytics page view tracking
import { createBrowserHistory } from "history";
const gaHistory = createBrowserHistory();
gaHistory.listen(location => {
  ReactGA.send({ hitType: "pageview", page: location.pathname });
});

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Web3ContextProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </Web3ContextProvider>
    );
  }
}
