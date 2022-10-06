import "@testing-library/jest-dom/extend-expect";

import { i18n } from "@lingui/core";
import * as matchers from "jest-extended";
import { en } from "make-plural/plurals";
import { messages } from "src/locales/translations/olympus-frontend/en/messages";

expect.extend(matchers);

global.CSS = { supports: jest.fn() };
jest.setTimeout(20000);
beforeAll(() => {
  i18n.loadLocaleData("en", { plurals: en });
  i18n.load("en", messages);
  i18n.activate("en");
});
beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

/**
afterEach(() => {
});

afterAll(() => {
});
 */
