import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import handlers from "./testHandlers";
import { i18n } from "@lingui/core";

global.CSS = { supports: jest.fn() };

const server = setupServer(...handlers);

beforeAll(() => {
  // Enable API mocking before tests.
  server.listen({ onUnhandledRequest: "bypass" });
  i18n.load("en", {});
  i18n.activate("en");
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
