// import puppeteer from "puppeteer";
// import dappetter from "@chainsafe/dappeteer";
const puppeteer = require("puppeteer");
const dappeteer = require("@chainsafe/dappeteer");

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

async function stake() {
  const browser = await dappeteer.launch(puppeteer, { metamaskVersion: "v10.1.1" });

  const metamask = await dappeteer.setupMetamask(browser, { seed: "agent divorce sleep alien rather maple east barrel stage anchor meadow basket milk abstract rifle tonight early captain total connect echo keep used impulse" });
  await metamask.switchNetwork("rinkeby");

  const page = await browser.newPage();
  await page.goto("http://localhost:3000/#/stake");

  await clickElement(page, ".connect-button");

  await metamask.approve();

  await metamask.reload();
  const metamaskPopup = await metamask.page.waitForSelector("button.popover-header__button");
  await metamaskPopup.click();

  await page.waitForSelector("#amount-input");
  await page.type("#amount-input", "1");
  await page.click(".stake-button");

  await metamask.confirmMetamaskTransaction();
}

stake();
