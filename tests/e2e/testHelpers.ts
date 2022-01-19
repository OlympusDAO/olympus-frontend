import { Dappeteer, launch } from "@chainsafe/dappeteer";
// @ts-ignore
import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";
import * as dappeteer from "@chainsafe/dappeteer";
import { getDocument, queries } from "pptr-testing-library";
import { ChildProcess } from "child_process";
import { exec } from "shelljs";

const REACT_APP_SEED_PHRASE = "REACT_APP_SEED_PHRASE";

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

const getMetamaskSeedPhrase = (): string => {
  if (!process.env.REACT_APP_SEED_PHRASE)
    throw new Error("Unable to find seed phrase for Metamask. Please set the " + REACT_APP_SEED_PHRASE + " variable");

  return process.env.REACT_APP_SEED_PHRASE;
};

export const setupMetamask = async (
  browser: Browser,
  options: { network?: string; privateKey?: string },
): Promise<Dappeteer> => {
  const seedPhrase = getMetamaskSeedPhrase();

  const metamask = await dappeteer.setupMetamask(browser, { seed: seedPhrase });
  await metamask.switchNetwork(options.network ?? "rinkeby");
  if (options.privateKey) await metamask.importPK(options.privateKey);

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
};

export async function launchDApp() {
  const browser = await launch(puppeteer, { metamaskVersion: "v10.1.1" });
  const metamask = await setupMetamask(browser, { network: "localhost" });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000/#/stake");

  dapp.browser = browser;
  dapp.metamask = metamask;
  dapp.page = page;
}

export function launchNode(): ChildProcess {
  const node = exec("yarn --cwd ../olympus-contracts start", { async: true });
  exec("yarn --cwd ../olympus-contracts deploy");
  return node;
}
export const typeValue = async (page: Page, selector: string, value: string) => {
  await page.bringToFront();
  await page.waitForSelector(selector);
  await page.type(selector, value);
};
