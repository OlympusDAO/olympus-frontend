const puppeteer = require("puppeteer");
const dappeteer = require("@chainsafe/dappeteer");
import { setupLogging, clickElement, setupMetamask, connectWallet } from "../../helpers/testHelpers";

// TODO integrate with jest
// TODO add test cases
// TODO deploy contracts on temporary network
// TODO add eth to wallet

var STAKE_AMOUNT = 0.1;

test("connects wallet", () => {
  const browser = await dappeteer.launch(puppeteer, { metamaskVersion: "v10.1.1" });

  const metamask = setupMetamask(browser);

  const page = await browser.newPage();
  await page.goto("http://localhost:3000/#/stake");

  setupLogging(page);
  setupLogging(metamask.page);

  connectWallet(page, metamask);

  // *** Approve the staking function
  await page.bringToFront();
  // Stake button (named "Approve")
  await clickElement(page, ".stake-button");
  // Bring Metamask front with the transaction modal
  await metamask.confirmTransaction();
  // Approve the transaction
  await metamask.approve();
})

async function stake() {
  // *** Stake OHM
  // await page.bringToFront();
  // await page.waitForSelector("#amount-input");
  // await page.type("#amount-input", "1");
  // await page.click(".stake-button");
  // await metamask.confirmTransaction();
}

stake();
