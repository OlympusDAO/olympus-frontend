import "@testing-library/jest-dom/extend-expect";

import { i18n } from "@lingui/core";

global.CSS = { supports: jest.fn() };

beforeAll(() => {
  i18n.load("en", {});
  i18n.activate("en");
});

/**
afterEach(() => {
});

afterAll(() => {
});
 */
