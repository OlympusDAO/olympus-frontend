import "@testing-library/jest-dom";
import {
  clickElement,
  connectWallet,
  selectorExists,
  waitSelectorExists,
  getSelectorTextContent,
  launchDApp,
  launchXvfb,
  closeXvfb,
  dapp,
} from "../../testHelpers";

xdescribe("bonding", () => {
  beforeAll(async () => {
    await launchXvfb();
    await launchDApp();
  });

  beforeEach(async () => {
    await dapp.page.goto("http://localhost:3000/#/bonds");
  });

  afterAll(async () => {
    dapp.browser.close();
    await closeXvfb();
  });

  test("cannot bond without connected wallet", async () => {
    const { page } = dapp;

    const selector = await page.waitForSelector("#ohm_lusd_lp--bond");
    await selector?.$eval("button", i => console.log(i));

    fail();
  });

  test("connects wallet", async () => {
    const { page, metamask } = dapp;

    // Connect button should be available
    expect(await selectorExists(page, "#wallet-button")).toBeTruthy();
    expect(await getSelectorTextContent(page, "#wallet-button")).toEqual("Connect Wallet");

    await connectWallet(page, metamask);

    // Connect button should be replaced by "Disconnect"
    expect(await waitSelectorExists(page, "#wallet-button")).toBeTruthy();
    expect(await getSelectorTextContent(page, "#wallet-button")).toEqual("Disconnect");
  });

  test("select first bond row and approve", async () => {
    const { page } = dapp;

    fail("TODO");
  });

  test("select first bond row and bond", async () => {
    const { page } = dapp;

    fail("TODO");
  });
});
