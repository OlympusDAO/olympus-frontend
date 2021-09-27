/* eslint-disable no-underscore-dangle */

import { createStore, applyMiddleware, compose } from "redux";

// Redux Thunk middleware allows you to write action creators that return a function instead of an action. The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met. The inner function receives the store methods dispatch and getState as parameters.
// Redux Logger is... logger
// If you're importing a constant, do NOT use brackets. If you're importing
// a function, like createLogger, then you must use brackets.
// See why we're loading redux-thunk: it's for async actions (https://redux.js.org/api-reference/store#dispatch)
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "../rootReducer";
import { EnvHelper } from "../helpers/Environment";

const loggerMiddleware = createLogger({});

const composeEnhancers =
  EnvHelper.env.NODE_ENV === "development" && typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

// This can now be used in Root.js as the Redux State Manager.
// https://github.com/reduxjs/redux/blob/master/docs/api/createStore.md
export default function configureStore(initialData) {
  return createStore(rootReducer, initialData, composeEnhancers(applyMiddleware(thunkMiddleware, loggerMiddleware)));
}
