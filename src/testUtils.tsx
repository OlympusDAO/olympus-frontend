import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { light as lightTheme } from "./themes/light.js";
import { Web3ContextProvider } from "./hooks/web3Context";
import store from "./store";
import { createMemoryHistory } from "history";
import App from "./App";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { ReactElement, ReactNode } from "react";

const ProviderWrapper = ({ children }: { children?: ReactNode }) => (
  <Web3ContextProvider>
    <Provider store={store}>
      <I18nProvider i18n={i18n}>
        <BrowserRouter basename={"/"}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </BrowserRouter>
      </I18nProvider>
    </Provider>
  </Web3ContextProvider>
);

const customRender = (ui: ReactElement, options?: RenderOptions): RenderResult =>
  render(ui, { wrapper: ProviderWrapper, ...options });

const renderRoute = function (route: string) {
  const history = createMemoryHistory();
  history.push(route);
  render(
    <Web3ContextProvider>
      <Provider store={store}>
        <I18nProvider i18n={i18n}>
          <BrowserRouter basename={"/#"}>
            <App />
          </BrowserRouter>
        </I18nProvider>
      </Provider>
    </Web3ContextProvider>,
  );
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render, renderRoute };
