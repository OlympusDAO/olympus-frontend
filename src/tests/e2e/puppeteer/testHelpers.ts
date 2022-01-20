import { Dappeteer, launch } from "@chainsafe/dappeteer";
import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";
import * as dappeteer from "@chainsafe/dappeteer";
import { getDocument, queries } from "pptr-testing-library";
// NOTE: I (jem) was unable to get the typings for this working. Resorting to ignoring the typescript error.
// @ts-ignore
var Xvfb = require("xvfb");

export const setupLogging = (page: Page) => {
  page
    .on("console", message => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
    .on("pageerror", ({ message }) => console.log(message));
};

export const clickElement = async (page: Page, selector: string) => {
  await page.bringToFront();
  await page.waitForSelector(selector);
  const element = await page.$(selector);
  if (!element) throw new Error("Could not find element with selector " + selector);

  await element.click();
};

const getMetamaskSeedPhrase = (): string | null => {
  if (!process.env.REACT_APP_SEED_PHRASE) return null;

  return process.env.REACT_APP_SEED_PHRASE;
};

const getMetamaskPrivateKey = (): string | null => {
  if (!process.env.REACT_APP_PRIVATE_KEY) return null;

  return process.env.REACT_APP_PRIVATE_KEY;
};

export const setupMetamask = async (browser: Browser, options: { network?: string }): Promise<Dappeteer> => {
  const seedPhrase = getMetamaskSeedPhrase();
  const privateKey = getMetamaskPrivateKey();

  const metamask = await dappeteer.setupMetamask(browser, seedPhrase ? { seed: seedPhrase } : {});
  await metamask.switchNetwork(options.network ?? "rinkeby");
  if (privateKey) await metamask.importPK(privateKey);

  return metamask;
};

export const connectWallet = async (page: Page, metamask: Dappeteer) => {
  // Connect button
  await clickElement(page, ".connect-button");
  // Metamask/Wallet Connect modal window
  await clickElement(page, ".web3modal-provider-wrapper");
  // Approve connecting the wallet
  await metamask.approve();
};

/**
 * Runs the OHM faucet to give the user's wallet 1 OHM.
 *
 * @param page the current puppeteer page
 * @param metamask instance of Dappeteer
 */
export const ohmFaucet = async (page: Page, metamask: Dappeteer) => {
  // Wallet menu button
  await clickElement(page, "#ohm-menu-button");

  // OHM faucet button
  await clickElement(page, "#ohm-faucet");

  // Metamask will then display a transaction approval screen
  await metamask.approve();
};

export const getByTestId = async (page: Page, testId: string): Promise<ElementHandle> => {
  const document = await getDocument(page);
  return queries.getByTestId(document, testId);
};

/**
 * Determine if the given selector exists on the page, without waiting for it to appear.
 *
 * @param page Puppeteer page
 * @param selector the selector representing the element, in the format of: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
 * @returns true if it exists
 */
export const selectorExists = async (page: Page, selector: string): Promise<boolean> => {
  return !!(await page.$(selector));
};

/**
 * If we wait for the selector to appear and it appears within the timeout, then it exists.
 *
 * @param page Puppeteer page
 * @param selector the selector representing the element, in the format of: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
 * @returns true if it exists
 */
export const waitSelectorExists = async (page: Page, selector: string): Promise<boolean> => {
  await page.bringToFront();

  try {
    await page.waitForSelector(selector);
    return true;
  } catch (e) {
    console.info("Encountered error when waiting for selector (" + selector + "): " + e);
    return false;
  }
};

export const getSelectorTextContent = async (page: Page, selector: string): Promise<string> => {
  await page.bringToFront();
  return page.evaluate(el => el.textContent.trim(), await page.$(selector));
};

export const dapp = {} as {
  browser: Browser;
  metamask: Dappeteer;
  page: Page;
  xvfb: typeof Xvfb;
};

export async function launchDApp(network: string = "localhost") {
  console.log("Starting metamask with network " + network);
  const browser = await launch(puppeteer, {
    metamaskVersion: "v10.1.1",
    headless: false,
    defaultViewport: null, // otherwise defaults to 800x600
    args: ["--no-sandbox", "--start-fullscreen", ...(isXvfbEnabled() ? ["--display=" + dapp.xvfb._display] : [])],
  });
  const metamask = await setupMetamask(browser, { network: network });

  const page = await browser.newPage();

  dapp.browser = browser;
  dapp.metamask = metamask;
  dapp.page = page;
}

export const typeValue = async (page: Page, selector: string, value: string) => {
  await page.bringToFront();
  await page.waitForSelector(selector);
  await page.type(selector, value);
};

export async function launchXvfb() {
  // Xvfb is disabled by default, and will typically only be used in a CI setting
  if (!isXvfbEnabled()) {
    console.debug("Not enabling Xvfb, due to the REACT_APP_XVFB_ENABLED environment variable.");
    return;
  }

  var xvfb = new Xvfb({
    silent: true,
    xvfb_args: ["-screen", "0", "1280x720x24", "-ac"],
  });

  await xvfb.start();

  dapp.xvfb = xvfb;
}

export async function closeXvfb() {
  await dapp.xvfb.stop();
}

export const isXvfbEnabled = (): boolean => {
  if (process.env.REACT_APP_XVFB_ENABLED) return true;

  return false;
};
