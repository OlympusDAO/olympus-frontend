import "@testing-library/jest-dom";
import {
  dapp,
  clickElement,
  connectWallet,
  selectorExists,
  waitSelectorExists,
  getSelectorTextContent,
  typeValue,
  launchDApp,
  launchXvfb,
  takeScreenshot,
} from "../../testHelpers";

var STAKE_AMOUNT = 0.1;

describe("staking", () => {
  beforeAll(async () => {
    await launchXvfb();
    await launchDApp();
  });

  beforeEach(async () => {
    await dapp.page.goto("http://localhost:3000/#/stake");
  });

  afterAll(async () => {
    dapp.browser.close();
    dapp.xvfb.stop();
  });

  test("cannot stake without connected wallet", async () => {
    const { page } = dapp;

    // Connect button should be available
    await page.screenshot({ path: "stake-unconnected-wallet.png" });
    expect(await getSelectorTextContent(page, "#ohm-menu-button")).toEqual("Connect Wallet");

    // Stake button not visible, as the "Connect Wallet" button is present
    expect(await selectorExists(page, "#stake-button")).toBeFalsy();
  });

  test("connects wallet", async () => {
    const { page, metamask } = dapp;

    // Connect button should be available
    expect(await selectorExists(page, "#ohm-menu-button")).toBeTruthy();

    await connectWallet(page, metamask);

    // Connect button should be replaced by "Approve"
    await page.bringToFront();
    expect(await waitSelectorExists(page, "#approve-stake-button")).toBeTruthy();

    // Wallet button has changed
    expect(await getSelectorTextContent(page, "#ohm-menu-button")).toEqual("Wallet");
    await page.screenshot({ path: "stake-connects-wallet-final.png" });
  });

  test("approves staking", async () => {
    const { page, metamask } = dapp;

    console.log("connect");
    await connectWallet(page, metamask);

    // *** Approve the staking function
    await page.bringToFront();
    // Stake button (named "Approve")
    console.log("before approve click");
    await clickElement(page, "#approve-stake-button");
    // Bring Metamask front with the transaction modal
    console.log("before confirm");
    await metamask.page.screenshot({ path: "stake-approve-staking-pre-confirm.png" });
    await metamask.confirmTransaction();
    await metamask.page.screenshot({ path: "stake-approve-staking-post-confirm.png" });

    // Button should be replaced by "Stake"
    console.log("before wait stake");
    await page.screenshot({ path: "post-confirm1.png" });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "post-confirm2.png" });
    expect(await waitSelectorExists(page, "#stake-button")).toBeTruthy();
    console.log("before exists approve stake");
    expect(await selectorExists(page, "#approve-stake-button")).toBeFalsy();
  });

  test("approves unstaking", async () => {
    const { page, metamask } = dapp;

    await connectWallet(page, metamask);

    // *** Approve the unstaking function
    await page.bringToFront();
    // Switch to the "Unstake" tab
    await clickElement(page, "#simple-tab-1");
    // Unstake button (named "Approve")
    await clickElement(page, "#approve-unstake-button");
    // Bring Metamask front with the transaction modal
    console.log("before confirm");
    await metamask.page.screenshot({ path: "stake-approve-staking-pre-confirm.png" });
    await metamask.confirmTransaction();
    await metamask.page.screenshot({ path: "stake-approve-staking-post-confirm.png" });

    // Button should be replaced by "Unstake"
    console.log("before wait stake");
    takeScreenshot(page, "post-confirm");
    takeScreenshot(metamask.page, "post-confirm-metamask");
    await page.waitForTimeout(5000);
    takeScreenshot(page, "post-confirm-timeout");
    takeScreenshot(metamask.page, "post-confirm-timeout-metamask");
    expect(await waitSelectorExists(page, "#unstake-button")).toBeTruthy();
    console.log("before exists approve stake");
    expect(await selectorExists(page, "#approve-unstake-button")).toBeFalsy();
  });

  test("staking", async () => {
    const { page, metamask } = dapp;

    await connectWallet(page, metamask);

    // Perform staking
    await typeValue(page, "#amount-input", STAKE_AMOUNT.toString());
    await clickElement(page, "#stake-button");
    await metamask.confirmTransaction();

    // Staked balance should be written as 0.1 sOHM
    expect(await getSelectorTextContent(page, "#user-staked-balance")).toEqual("0.1 sOHM");
    expect(await waitSelectorExists(page, "#unstake-button")).toBeTruthy();
    expect(await selectorExists(page, "#stake-button")).toBeFalsy();
  });

  test("unstaking", async () => {
    const { page, metamask } = dapp;

    await connectWallet(page, metamask);

    // Perform staking
    await typeValue(page, "#amount-input", STAKE_AMOUNT.toString());
    await clickElement(page, "#stake-button");
    await metamask.confirmTransaction();

    // Perform unstaking
    await typeValue(page, "#amount-input", STAKE_AMOUNT.toString());
    await clickElement(page, "#unstake-button");
    await metamask.confirmTransaction();

    // Staked balance should be written as 0.0 sOHM
    expect(await getSelectorTextContent(page, "#user-staked-balance")).toEqual("0 sOHM");
  });
});
