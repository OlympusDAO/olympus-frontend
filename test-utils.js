import React from "react";
import { render } from "@testing-library/react";
import store from "./src/store.ts";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Web3ContextProvider } from "./src/hooks/web3Context";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { light as lightTheme } from "./src/themes/light.js";

const AllTheProviders = ({ children }) => {
  return (
    <Web3ContextProvider>
      <Provider store={store}>
        <BrowserRouter basename={"/#"}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </Web3ContextProvider>
  );
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
