// import puppeteer from "puppeteer";
// import dappetter from "@chainsafe/dappeteer";
const puppeteer = require("puppeteer");
const dappeteer = require("@chainsafe/dappeteer");

// TODO integrate with jest
// TODO add test cases
// TODO deploy contracts on temporary network
// TODO add eth to wallet

var STAKE_AMOUNT = 0.1;
// Sometimes we need to round float values because bigint type does not exist (yet) in javascript
function ohmRound(val) {
  var m = Math.pow(10, 10);
  return Math.round(parseFloat(val) * m) / m;
}

async function clickElement(page, selector) {
  await page.bringToFront();
  await page.waitForSelector(selector);
  const element = await page.$(selector);
  await element.click();
}

const setupLogging = (page) => {
  page
    .on('console', message =>
      console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
    .on('pageerror', ({ message }) => console.log(message));
};

async function stake() {
  const browser = await dappeteer.launch(puppeteer, { metamaskVersion: "v10.1.1" });

  // Wallet address: 0x877E146d822087F8ccAa8ef2e6351B17Aa9a034A
  const metamask = await dappeteer.setupMetamask(browser, { seed: "agent divorce sleep alien rather maple east barrel stage anchor meadow basket milk abstract rifle tonight early captain total connect echo keep used impulse" });
  await metamask.switchNetwork("rinkeby");

  const page = await browser.newPage();
  await page.goto("http://localhost:3000/#/stake");

  setupLogging(page);
  setupLogging(metamask.page);

  // *** Connect the wallet
  // Connect button
  await clickElement(page, ".connect-button");
  // Metamask/Wallet Connect modal window
  await clickElement(page, ".web3modal-provider-wrapper");
  // Approve connecting the wallet
  await metamask.approve();

  // *** Approve the staking function
  await page.bringToFront();
  // Stake button (named "Approve")
  await clickElement(page, ".stake-button");
  // Bring Metamask front with the transaction modal
  await metamask.confirmTransaction();
  // Approve the transaction
  await metamask.approve();

  // *** Stake OHM
  // await page.bringToFront();
  // await page.waitForSelector("#amount-input");
  // await page.type("#amount-input", "1");
  // await page.click(".stake-button");
  // await metamask.confirmTransaction();
}

stake();
