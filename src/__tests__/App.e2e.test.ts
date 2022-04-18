import "@testing-library/jest-dom";

import { clickElement, dapp, launchApp, waitForContent } from "../../tests/e2e/testHelpers";

jest.setTimeout(20000);
describe("Change language", () => {
  beforeAll(async () => {
    await launchApp();
  }),
    afterAll(async () => {
      const { browser } = dapp;
      browser.close();
    }),
    it("Content ", async () => {
      const { page } = dapp;
      console.log(page);

      // Connect button should be available
      // Make sure we are on the english version of the site
      await waitForContent(page, "body", "Single Stake");
      // Click on the language menu
      await clickElement(page, '[aria-describedby="locales-popper"]');
      // Click on the French icno
      await clickElement(page, "#flag-icon-css-fr");
      // Check that the text was translated in French
      await waitForContent(page, "body", "Dépôt simple");
    });
});
