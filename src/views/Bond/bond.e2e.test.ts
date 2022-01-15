import "@testing-library/jest-dom";
import {
  clickElement,
  setupMetamask,
  connectWallet,
  selectorExists,
  waitSelectorExists,
  getSelectorTextContent,
  typeValue,
} from "../../../tests/e2e/testHelpers";
import puppeteer, { Browser, Page } from "puppeteer";
import { launch, Dappeteer } from "@chainsafe/dappeteer";

describe("bonding", () => {
  let browser: Browser;
  let metamask: Dappeteer;
  let page: Page;

  beforeEach(async () => {
    browser = await launch(puppeteer, { metamaskVersion: "v10.1.1" });

    metamask = await setupMetamask(browser);

    page = await browser.newPage();
    await page.goto("http://localhost:3000/#/bonds");
    await page.bringToFront();
  });

  afterEach(async () => {
    await browser.close();
  });

  test.only("cannot bond without connected wallet", async () => {
    const selector = await page.waitForSelector("#ohm_lusd_lp--bond");
    await selector?.$eval("button", i => console.log(i));

    fail();
  });

  test("connects wallet", async () => {
    // Connect button should be available
    expect(await selectorExists(page, "#wallet-button")).toBeTruthy();
    expect(await getSelectorTextContent(page, "#wallet-button")).toEqual("Connect Wallet");

    await connectWallet(page, metamask);

    // Connect button should be replaced by "Disconnect"
    expect(await waitSelectorExists(page, "#wallet-button")).toBeTruthy();
    expect(await getSelectorTextContent(page, "#wallet-button")).toEqual("Disconnect");
  });

  test("select first bond row and approve", async () => {
    fail("TODO");

  });

  test("select first bond row and bond", async () => {
    fail("TODO");
  });
});
