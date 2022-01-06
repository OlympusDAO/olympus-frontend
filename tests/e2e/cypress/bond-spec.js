const helpers = require("../helpers.js");

function accessTab(token, tab) {
  // Go to the app
  cy.visit("/#");
  // Connect wallet
  cy.get("#wallet-button").click();
  cy.get(".web3modal-provider-name").contains("MetaMask").click();
  // Ensure that we are connected
  cy.get("#wallet-button").should("contain", "Disconnect");
  // Go to bonds page
  cy.visit("/#/bonds");
  // Wait for data to be loaded
  cy.get(`tr#${token}--bond .bond-price`);
  // Choose token
  //cy.wait(5000);
  cy.get(`tr#${token}--bond button`).click();
  // Access tab
  cy.get(`[aria-label="${tab}-tab-button"]`).click();
}
function itBonds(token) {
  it(`Bond ${helpers.BOND_AMOUNT} ${token}`, () => {
    accessTab(token, "bond");
    // Approve spend limit
    cy.get("#bond-approve-btn").click();
    cy.wait(1000);
    cy.confirmMetamaskPermissionToSpend();
    // Wait for balance to be loaded
    cy.get("#bond-balance").invoke("text").should("not.eq", "");
    cy.get("#bond-balance").invoke("text").should("not.eq", `0 ${token.toUpperCase()}`);
    // Bond and check that balance changed accordingly
    cy.get("#bond-balance").then($p => {
      const balance_before_txt = $p.text();
      const target_balance = helpers.round(helpers.round(balance_before_txt) - helpers.BOND_AMOUNT);
      // Enter amount
      cy.get(".ohm-input #outlined-adornment-amount").type(helpers.BOND_AMOUNT);
      // Bond
      cy.get("#bond-btn").click();
      // Confirm in case we have a bond running with this wallet
      cy.on("window:confirm", () => {});
      // Confirm transaction (Ugly but could not find how to mke it work otherwise)
      cy.wait(1000);
      cy.confirmMetamaskTransaction();
      // Wait for expected balance
      cy.get("#bond-balance").invoke("text").should("contain", target_balance);
    });
    assert(true);
  });
}

function itClaims(token) {
  it(`Claim ${token}`, () => {
    accessTab(token, "redeem");
    // Wait for claimable info to be visible
    cy.get("#claimable").invoke("text").should("not.eq", "");
    // Claim
    cy.get("#bond-claim-btn").click();
    cy.wait(1000);
    cy.confirmMetamaskTransaction();
    // Check transaction (I am not sure how to make that robust)
    cy.get("#claimable").invoke("text").should("contain", "0.0");
    assert(true);
  });
}
function itClaimsAndStakes(token) {
  it(`Claim and stake ${token}`, () => {
    accessTab(token, "redeem");
    // Wait for claimable info to be visible
    cy.get("#claimable").invoke("text").should("not.eq", "");
    // Claim and stake
    cy.get("#bond-claim-autostake-btn").click();
    cy.wait(1000);
    cy.confirmMetamaskTransaction();
    cy.get("#claimable").invoke("text").should("contain", "0.0");
    assert(true);
  });
}
describe("Bond tests", () => {
  before(() => {
    // Accept Metamask Access
    cy.visit("/#");
    cy.get("#wallet-button").click();
    cy.get(".web3modal-provider-name").contains("MetaMask").click();
    cy.acceptMetamaskAccess();
    // Disconnect
    cy.get("#wallet-button").click();
  });
  itBonds("frax");
  itClaims("frax");
  itClaimsAndStakes("frax");
});
