import { Dappeteer, launch } from "@chainsafe/dappeteer";
import * as dappeteer from "@chainsafe/dappeteer";
import { getDocument, queries } from "pptr-testing-library";
import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";
// NOTE: I (jem) was unable to get the typings for this working. Resorting to ignoring the typescript error.
// @ts-ignore
import Xvfb from "xvfb";

export const getTestName = (): string => {
  return expect.getState().currentTestName;
};

export const takeScreenshot = (page: Page, title: string) => {
  const compatibleTestName = getTestName().replace(/\ /g, "-");
  page.screenshot({ path: compatibleTestName + "-" + title + ".png" }).then(() => {
    console.log("Took screenshot with title: " + title);
  });
};

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
  metamask.page.screenshot({ path: "metamask-setup.png" });

  await metamask.switchNetwork(options.network ?? "rinkeby");
  metamask.page.screenshot({ path: "metamask-network.png" });

  if (privateKey) await metamask.importPK(privateKey);

  return metamask;
};

export const connectWallet = async (page: Page, metamask: Dappeteer) => {
  // Connect button
  await clickElement(page, "#ohm-menu-button");
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
  confirmTransaction(metamask);
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

export async function launchDApp(network = "localhost") {
  console.log("Starting metamask with network " + network);
  const browser = await launch(puppeteer, {
    metamaskVersion: "v10.1.1",
    headless: false,
    defaultViewport: null, // otherwise defaults to 800x600
    args: ["--no-sandbox", ...(isXvfbEnabled() ? ["--display=" + dapp.xvfb._display] : [])],
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

  const xvfb = new Xvfb({
    silent: true,
    xvfb_args: ["-screen", "0", "1280x720x24", "-ac"],
  });

  await xvfb.start();

  dapp.xvfb = xvfb;
}

export async function closeXvfb() {
  if (!isXvfbEnabled()) return;

  await dapp.xvfb.stop();
}

export const isXvfbEnabled = (): boolean => {
  if (process.env.REACT_APP_XVFB_ENABLED) return true;

  return false;
};

// *** Ripped from TradeTrust/tradetrust-website#518

// manually dismiss banner!
// news popup keeps re-appearing AFTER some metamask actions
// clue (dasanra's fork) -> dasanra/dappeteer@3656360e4f891a3e7d1e80e77a40b2cfb83af2c8
export const checkAndCloseNewsPopOver = async (metamask: Dappeteer) => {
  await metamask.page.waitFor(1000);
  const isPopOverOpen = await metamask.page.evaluate(() => {
    return document.querySelector(".whats-new-popup__popover") !== null;
  });

  if (isPopOverOpen) {
    const closePopOverButton = await metamask.page.waitForSelector(".popover-header__button");
    closePopOverButton && (await closePopOverButton.click());
  }
  await metamask.page.waitFor(1000);
};

// ChainSafe/dappeteer#67
export const confirmTransaction = async (metamask: Dappeteer) => {
  await checkAndCloseNewsPopOver(metamask);
  await metamask.confirmTransaction();
  await metamask.page.waitForSelector(".btn-primary:not([disabled])", { visible: true });
  await metamask.page.click(".btn-primary:not([disabled])");
  await checkAndCloseNewsPopOver(metamask);
};
