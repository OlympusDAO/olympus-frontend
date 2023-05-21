import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { BrowserRouter } from "react-router-dom";
import { dark as darkTheme } from "../src/themes/dark.js";
import { light as lightTheme } from "../src/themes/light.js";
import "../src/style.scss";
import React from "react";
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "dark",
    toolbar: {
      icon: "circlehollow",
      // Array of plain string values or MenuItem shape (see below)
      items: ["light", "dark"],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

export const decorators = [
  (Story, options) => {
    const { globals } = options;
    const theme = globals.theme === "dark" ? darkTheme : lightTheme;
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <CssBaseline />
            <Story />
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  },
];
