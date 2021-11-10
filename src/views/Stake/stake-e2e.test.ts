import "@testing-library/jest-dom";
import {
  dapp,
  clickElement,
  connectWallet,
  selectorExists,
  waitSelectorExists,
  getSelectorTextContent,
} from "../../helpers/testHelpers";

// TODO deploy contracts on temporary network
// TODO add eth to wallet

var STAKE_AMOUNT = 0.1;

describe("staking", () => {
  xtest("connects wallet", async () => {
    const { page, metamask } = dapp;

    // Connect button should be available
    expect(await selectorExists(page, "#stake-connect-wallet")).toBeTruthy();

    await connectWallet(page, metamask);

    // Connect button should be replaced by "Approve"
    await page.bringToFront();
    expect(await waitSelectorExists(page, "#approve-stake-button")).toBeTruthy();
    expect(await selectorExists(page, "#stake-connect-wallet")).toBeFalsy();
  });

  test("approves staking", async () => {
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
    await page.bringToFront();
    expect(await waitSelectorExists(page, "#stake-button")).toBeTruthy();
    expect(await selectorExists(page, "#approve-stake-button")).toBeFalsy();
  });

  test("perform staking", async () => {
    const { page, metamask } = dapp;

    await connectWallet(page, metamask);

    // Perform staking
    await page.bringToFront();
    await page.waitForSelector("#amount-input");
    await page.type("#amount-input", STAKE_AMOUNT.toString());
    await clickElement(page, "#stake-button");
    await metamask.confirmTransaction();

    // Staked balance should be written as 0.1 sOHM
    await page.bringToFront();
    expect(await getSelectorTextContent(page, "#user-staked-balance")).toEqual("0.1 sOHM");
  });
});
