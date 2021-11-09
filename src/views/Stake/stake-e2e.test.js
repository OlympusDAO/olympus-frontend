const puppeteer = require("puppeteer");
const dappeteer = require("@chainsafe/dappeteer");
import { setupLogging, clickElement, setupMetamask, connectWallet, getByTestId } from "../../helpers/testHelpers";
import "@testing-library/jest-dom";
require("pptr-testing-library/extend");

// TODO integrate with jest
// TODO add test cases
// TODO deploy contracts on temporary network
// TODO add eth to wallet

var STAKE_AMOUNT = 0.1;

describe("staking", () => {
  let browser;
  let metamask;
  let page;

  beforeEach(async () => {
    browser = await dappeteer.launch(puppeteer, { metamaskVersion: "v10.1.1" });

    metamask = setupMetamask(browser);

    page = await browser.newPage();
    await page.goto("http://localhost:3000/#/stake");
    await page.bringToFront();

    // console.log("before page");
    // setupLogging(page);
    // console.log("after page");
    // setupLogging(metamask.page);
    // console.log("after metamask page");
  });

  afterEach(async () => {
    await browser.close();
  });

  test("connects wallet", async () => {
    // Button should be available
    const connectButton = await getByTestId(page, "stake-connect-wallet");
    expect(connectButton).toBeEnabled();
    expect(connectButton).toBeVisible();

    connectWallet(page, metamask);

    // Button should be replaced by "Approve"
    await page.bringToFront();
    const connectButtonUpdated = await getByTestId(page, "stake-connect-wallet");
    expect(connectButtonUpdated).toBeEnabled();
    expect(connectButtonUpdated).not.toBeVisible();

    const approveButton = await getByTestId(page, "approve-stake-button");
    expect(approveButton).toBeEnabled();
    expect(approveButton).toBeVisible();
  });

  xtest("approves staking", async () => {
    connectWallet(page, metamask);

    // *** Approve the staking function
    await page.bringToFront();
    // Stake button (named "Approve")
    await clickElement(page, ".stake-button");
    // Bring Metamask front with the transaction modal
    await metamask.confirmTransaction();
    // Approve the transaction
    await metamask.approve();

    // Button should be replaced by "Stake"
    await page.bringToFront();
    expect(queryByTitle("Approve")).toBeUndefined();
    expect(queryByTitle("Stake")).toBeDefined();
  });

  xtest("perform staking", async () => {
    connectWallet(page, metamask);

    // *** Approve the staking function
    await page.bringToFront();
    // Stake button (named "Approve")
    await clickElement(page, ".stake-button");
    // Bring Metamask front with the transaction modal
    await metamask.confirmTransaction();
    // Approve the transaction
    await metamask.approve();

    // Perform staking
    await page.bringToFront();
    await page.waitForSelector("#amount-input");
    await page.type("#amount-input", STAKE_AMOUNT);
    await page.click(".stake-button");
    await metamask.confirmTransaction();

    // Staked balance should be written as 0.1 sOHM
    const stakedBalance = await page.$("#user-staked-balance", el => el.textContent.trim());
    expect(stakedBalance).toEqual("0.1 sOHM");
  });
});
