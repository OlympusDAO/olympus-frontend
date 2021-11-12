// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { launchDApp, launchNode } from "./e2e/puppeteer/testHelpers";

// TODO add jest-puppeteer preset

jest.setTimeout(60000);
