import { createStore, applyMiddleware } from "redux";

// Redux Thunk middleware allows you to write action creators that return a function instead of an action. The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met. The inner function receives the store methods dispatch and getState as parameters.
// Redux Logger is... logger
// If you're importing a constant, do NOT use brackets. If you're importing
// a function, like createLogger, then you must use brackets.
// See why we're loading redux-thunk: it's for async actions (https://redux.js.org/api-reference/store#dispatch)
import thunkMiddleware from "redux-thunk";
import rootReducer from "../rootReducer";

// This can now be used in Root.js as the Redux State Manager.
// https://github.com/reduxjs/redux/blob/master/docs/api/createStore.md
export default function configureStore(initialData) {
  return createStore(rootReducer, initialData, applyMiddleware(thunkMiddleware));
}
