import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
// Rainbowkit
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React, { ReactElement, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "src/App";
import Messages from "src/components/Messages/Messages";
import { ReactQueryProvider } from "src/lib/react-query";
import defaultStore from "src/store";
import { setupClient } from "src/testHelpers";
import { light as lightTheme } from "src/themes/light.js";
import { WagmiConfig } from "wagmi";

const customRender = (ui: ReactElement, store = defaultStore, options?: RenderOptions): RenderResult => {
  const wagmiClient = setupClient({ autoConnect: true });
  const ProviderWrapper = ({ children }: { children?: ReactNode }) => (
    <WagmiConfig client={wagmiClient}>
      <ReactQueryProvider>
        <Provider store={store}>
          <HashRouter>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <Toaster>{t => <Messages toast={t} />}</Toaster>
                {children}
              </ThemeProvider>
            </StyledEngineProvider>
          </HashRouter>
        </Provider>
      </ReactQueryProvider>
    </WagmiConfig>
  );
  return render(ui, { wrapper: ProviderWrapper, ...options });
};

const renderRoute = function (route: string, store = defaultStore) {
  const wagmiClient = setupClient({ autoConnect: true });
  const history = createMemoryHistory();
  history.push(route);
  return render(
    <WagmiConfig client={wagmiClient}>
      <ReactQueryProvider>
        <Provider store={store}>
          <HashRouter>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <Toaster>{t => <Messages toast={t} />}</Toaster>
                <App />
              </ThemeProvider>
            </StyledEngineProvider>
          </HashRouter>
        </Provider>
      </ReactQueryProvider>
    </WagmiConfig>,
  );
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
