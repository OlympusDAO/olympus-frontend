import "@testing-library/jest-dom/extend-expect";

import { i18n } from "@lingui/core";
import * as matchers from "jest-extended";
import { en } from "make-plural/plurals";
import { messages } from "src/locales/translations/olympus-frontend/en/messages";

expect.extend(matchers);

global.CSS = { supports: jest.fn() };

beforeAll(() => {
  i18n.loadLocaleData("en", { plurals: en });
  i18n.load("en", messages);
  i18n.activate("en");
});

/**
afterEach(() => {
});

afterAll(() => {
});
 */
