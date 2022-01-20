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
  closeXvfb,
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
    await closeXvfb();
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
  });

  test("approves staking", async () => {
    const { page, metamask } = dapp;

    await connectWallet(page, metamask);

    // *** Approve the staking function
    await page.bringToFront();
    // Stake button (named "Approve")
    await clickElement(page, "#approve-stake-button");
    // Bring Metamask front with the transaction modal
    await metamask.confirmTransaction();
    // Approve the transaction
    await metamask.approve();

    // Button should be replaced by "Stake"
    expect(await waitSelectorExists(page, "#stake-button")).toBeTruthy();
    expect(await selectorExists(page, "#approve-stake-button")).toBeFalsy();
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
