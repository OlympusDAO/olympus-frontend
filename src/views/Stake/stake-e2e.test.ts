const puppeteer = require("puppeteer");
const dappeteer = require("@chainsafe/dappeteer");
import {
  clickElement,
  setupMetamask,
  connectWallet,
  selectorExists,
  waitSelectorExists,
} from "../../helpers/testHelpers";
import "@testing-library/jest-dom";
import { Browser, Page } from "puppeteer";
import { Dappeteer } from "@chainsafe/dappeteer";

// TODO add test cases
// TODO deploy contracts on temporary network
// TODO add eth to wallet

var STAKE_AMOUNT = 0.1;

describe("staking", () => {
  let browser: Browser;
  let metamask: Dappeteer;
  let page: Page;

  beforeEach(async () => {
    browser = await dappeteer.launch(puppeteer, { metamaskVersion: "v10.1.1" });

    metamask = await setupMetamask(browser);

    page = await browser.newPage();
    await page.goto("http://localhost:3000/#/stake");
    await page.bringToFront();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("connects wallet", async () => {
    // Connect button should be available
    expect(await selectorExists(page, "#stake-connect-wallet")).toBeTruthy();

    connectWallet(page, metamask);

    // Connect button should be replaced by "Approve"
    await page.bringToFront();
    expect(await waitSelectorExists(page, "#approve-stake-button")).toBeTruthy();
    expect(await selectorExists(page, "#stake-connect-wallet")).toBeFalsy();
  });

  // xtest("approves staking", async () => {
  //   connectWallet(page, metamask);

  //   // *** Approve the staking function
  //   await page.bringToFront();
  //   // Stake button (named "Approve")
  //   await clickElement(page, ".stake-button");
  //   // Bring Metamask front with the transaction modal
  //   await metamask.confirmTransaction();
  //   // Approve the transaction
  //   await metamask.approve();

  //   // Button should be replaced by "Stake"
  //   await page.bringToFront();
  //   expect(queryByTitle("Approve")).toBeUndefined();
  //   expect(queryByTitle("Stake")).toBeDefined();
  // });

  // xtest("perform staking", async () => {
  //   connectWallet(page, metamask);

  //   // *** Approve the staking function
  //   await page.bringToFront();
  //   // Stake button (named "Approve")
  //   await clickElement(page, ".stake-button");
  //   // Bring Metamask front with the transaction modal
  //   await metamask.confirmTransaction();
  //   // Approve the transaction
  //   await metamask.approve();

  //   // Perform staking
  //   await page.bringToFront();
  //   await page.waitForSelector("#amount-input");
  //   await page.type("#amount-input", STAKE_AMOUNT);
  //   await page.click(".stake-button");
  //   await metamask.confirmTransaction();

  //   // Staked balance should be written as 0.1 sOHM
  //   const stakedBalance = await page.$("#user-staked-balance", el => el.textContent.trim());
  //   expect(stakedBalance).toEqual("0.1 sOHM");
  // });
});
