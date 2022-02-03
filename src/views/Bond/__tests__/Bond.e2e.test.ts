import "@testing-library/jest-dom";

import { Dappeteer, launch } from "@chainsafe/dappeteer";
import puppeteer, { Browser, Page } from "puppeteer";

import {
  connectWallet,
  getSelectorTextContent,
  selectorExists,
  setupMetamask,
  waitSelectorExists,
} from "../../../../tests/e2e/testHelpers";

describe.skip("Bond E2E Tests", () => {
  let browser: Browser;
  let metamask: Dappeteer;
  let page: Page;

  beforeEach(async () => {
    browser = await launch(puppeteer, { metamaskVersion: "v10.1.1" });

    metamask = await setupMetamask(browser, {});

    page = await browser.newPage();
    await page.goto("http://localhost:3000/#/bonds");
    await page.bringToFront();
  });

  afterEach(async () => {
    await browser.close();
  });

  it("cannot bond without connected wallet", async () => {
    const selector = await page.waitForSelector("#ohm_lusd_lp--bond");
    await selector?.$eval("button", i => console.log(i));

    fail();
  });

  it("connects wallet", async () => {
    // Connect button should be available
    expect(await selectorExists(page, "#wallet-button")).toBeTruthy();
    expect(await getSelectorTextContent(page, "#wallet-button")).toEqual("Connect Wallet");

    await connectWallet(page, metamask);

    // Connect button should be replaced by "Disconnect"
    expect(await waitSelectorExists(page, "#wallet-button")).toBeTruthy();
    expect(await getSelectorTextContent(page, "#wallet-button")).toEqual("Disconnect");
  });
});
