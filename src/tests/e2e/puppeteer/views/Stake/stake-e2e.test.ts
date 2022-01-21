import "@testing-library/jest-dom";

import {
  clickElement,
  closeXvfb,
  confirmTransaction,
  connectWallet,
  dapp,
  getSelectorTextContent,
  launchDApp,
  launchXvfb,
  ohmFaucet,
  selectorExists,
  takeScreenshot,
  typeValue,
  waitSelectorExists,
} from "../../testHelpers";

const STAKE_AMOUNT = 0.1;

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
    await closeXvfb();
  });

  test("cannot stake without connected wallet", async () => {
    const { page } = dapp;

    // Connect button should be available
    takeScreenshot(page, "wallet not connected");
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
    takeScreenshot(page, "after wallet connected");
  });

  test("approves staking", async () => {
    const { page, metamask } = dapp;

    await connectWallet(page, metamask);
    takeScreenshot(page, "after wallet connected");

    // *** Approve the staking function
    // Stake button (named "Approve")
    await clickElement(page, "#approve-stake-button");
    // Approve the staking contract
    takeScreenshot(page, "after click approve stake");
    takeScreenshot(metamask.page, "after click approve stake metamask");
    confirmTransaction(metamask);
    takeScreenshot(page, "after confirm approve stake");
    takeScreenshot(metamask.page, "after confirm approve stake metamask");

    // Button should be replaced by "Stake"
    expect(await waitSelectorExists(page, "#stake-button")).toBeTruthy();
    expect(await selectorExists(page, "#approve-stake-button")).toBeFalsy();
  });

  test("approves unstaking", async () => {
    const { page, metamask } = dapp;

    await connectWallet(page, metamask);

    // *** Approve the unstaking function
    // Switch to the "Unstake" tab
    await clickElement(page, "#simple-tab-1");
    // Unstake button (named "Approve")
    await clickElement(page, "#approve-unstake-button");
    // Approve the unstaking contract
    takeScreenshot(page, "after click approve unstake");
    takeScreenshot(metamask.page, "after click approve unstake metamask");
    confirmTransaction(metamask);
    takeScreenshot(page, "after confirm approve unstake");
    takeScreenshot(metamask.page, "after confirm approve stake unmetamask");

    // Button should be replaced by "Unstake"
    expect(await waitSelectorExists(page, "#unstake-button")).toBeTruthy();
    expect(await selectorExists(page, "#approve-unstake-button")).toBeFalsy();
  });

  test("staking", async () => {
    const { page, metamask } = dapp;

    await connectWallet(page, metamask);

    // Approve staking
    await clickElement(page, "#approve-stake-button");
    confirmTransaction(metamask);

    // Get OHM from the faucet
    await ohmFaucet(page, metamask);

    // Perform staking
    await typeValue(page, "#amount-input", STAKE_AMOUNT.toString());
    await clickElement(page, "#stake-button");
    confirmTransaction(metamask);

    // Staked balance should be written as 0.1 sOHM
    expect(await getSelectorTextContent(page, "#user-staked-balance")).toEqual("0.1 sOHM");
  });

  test("unstaking", async () => {
    const { page, metamask } = dapp;

    await connectWallet(page, metamask);

    // Approve staking
    await clickElement(page, "#approve-stake-button");
    confirmTransaction(metamask);

    // Get OHM from the faucet
    await ohmFaucet(page, metamask);

    // Perform staking
    await typeValue(page, "#amount-input", STAKE_AMOUNT.toString());
    await clickElement(page, "#stake-button");
    confirmTransaction(metamask);

    // Switch to the "Unstake" tab
    await clickElement(page, "#simple-tab-1");
    // Unstake button (named "Approve")
    await clickElement(page, "#approve-unstake-button");
    // Approve the unstaking contract
    confirmTransaction(metamask);

    // Perform unstaking
    await typeValue(page, "#amount-input", STAKE_AMOUNT.toString());
    await clickElement(page, "#unstake-button");
    confirmTransaction(metamask);

    // Staked balance should be written as 0.0 sOHM
    expect(await getSelectorTextContent(page, "#user-staked-balance")).toEqual("0 sOHM");
  });
});
