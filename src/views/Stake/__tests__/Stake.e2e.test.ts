import "@testing-library/jest-dom";

import {
  clickElement,
  connectWallet,
  dapp,
  getSelectorTextContent,
  selectorExists,
  typeValue,
  waitSelectorExists,
} from "../../../../tests/e2e/testHelpers";

// TODO deploy contracts on temporary network
// TODO add eth to wallet
// TODO close Chromium after test case

const STAKE_AMOUNT = 0.1;

describe.skip("Staking", () => {
  it("cannot stake without connected wallet", async () => {
    const { page } = dapp;

    // Connect button should be available
    expect(await selectorExists(page, "#stake-connect-wallet")).toBeTruthy();

    // Stake button not visible
    expect(await selectorExists(page, "#stake-button")).toBeFalsy();
  });

  it("connects wallet", async () => {
    const { page, metamask } = dapp;

    // Connect button should be available
    expect(await selectorExists(page, "#stake-connect-wallet")).toBeTruthy();

    await connectWallet(page, metamask);

    // Connect button should be replaced by "Approve"
    await page.bringToFront();
    expect(await waitSelectorExists(page, "#approve-stake-button")).toBeTruthy();
    expect(await selectorExists(page, "#stake-connect-wallet")).toBeFalsy();
  });

  it("approves staking", async () => {
    const { page, metamask } = dapp;

    await connectWallet(page, metamask);

    // NOTE: we may want to re-enable this when moving onto a single-use testnet, as the approval status won't persist
    // *** Approve the staking function
    // await page.bringToFront();
    // Stake button (named "Approve")
    // await clickElement(page, "#approve-stake-button");
    // Bring Metamask front with the transaction modal
    // await metamask.confirmTransaction();
    // Approve the transaction
    // await metamask.approve();

    // Button should be replaced by "Stake"
    expect(await waitSelectorExists(page, "#stake-button")).toBeTruthy();
    expect(await selectorExists(page, "#approve-stake-button")).toBeFalsy();
  });

  it("staking", async () => {
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

  it("unstaking", async () => {
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
