const REACT_APP_SEED_PHRASE = "REACT_APP_SEED_PHRASE";
const dappeteer = require("@chainsafe/dappeteer");

// Sometimes we need to round float values because bigint type does not exist (yet) in javascript
function ohmRound(val) {
  var m = Math.pow(10, 10);
  return Math.round(parseFloat(val) * m) / m;
}

export const setupLogging = page => {
  page
    .on("console", message => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
    .on("pageerror", ({ message }) => console.log(message));
};

export const clickElement = async (page, selector) => {
  await page.bringToFront();
  await page.waitForSelector(selector);
  const element = await page.$(selector);
  await element.click();
};

const getMetamaskSeedPhrase = () => {
  if (!process.env.REACT_APP_SEED_PHRASE)
    throw new Error("Unable to find seed phrase for Metamask. Please set the " + REACT_APP_SEED_PHRASE + " variable");

  return process.env.REACT_APP_SEED_PHRASE;
};

export const setupMetamask = async browser => {
  const seedPhrase = getMetamaskSeedPhrase();

  const metamask = await dappeteer.setupMetamask(browser, { seed: seedPhrase });
  await metamask.switchNetwork("rinkeby");

  return metamask;
};

export const connectWallet = async (page, metamask) => {
  // Connect button
  await clickElement(page, ".connect-button");
  // Metamask/Wallet Connect modal window
  await clickElement(page, ".web3modal-provider-wrapper");
  // Approve connecting the wallet
  await metamask.approve();
};
