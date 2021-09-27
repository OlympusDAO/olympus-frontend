var STAKE_AMOUNT = 0.1;
// Sometimes we need to round float values because bigint type does not exist (yet) in javascript
function ohmRound(val) {
  var m = Math.pow(10, 10);
  return Math.round(parseFloat(val) * m) / m;
}
describe("Stake tests", () => {
  beforeEach(() => {
    cy.visit("/#/");
  });
  it(`Stake ${STAKE_AMOUNT} OHM`, () => {
    cy.get("#wallet-button span").contains("Connect Wallet");
    cy.get("#wallet-button").click();
    cy.get(".web3modal-provider-name").contains("MetaMask").click();
    cy.acceptMetamaskAccess();
    cy.get(".stake-button").contains("Approve");
    cy.get("#amount-input").type(STAKE_AMOUNT);
    // Approve spend limit
    cy.get(".stake-button").click();
    cy.confirmMetamaskPermissionToSpend();
    // Stake and check that balance changed accordingly
    cy.get("#user-balance").then($p => {
      const balance_before_txt = $p.text();
      const target_balance = ohmRound(ohmRound(balance_before_txt) - STAKE_AMOUNT);
      // Stake
      // can/should we chain this contains + click?
      cy.get(".stake-button").contains("Stake OHM");
      cy.get(".stake-button").click();
      // check wallet button says "in progress"
      cy.get("#wallet-button").contains("In progress");
      cy.confirmMetamaskTransaction();
      cy.get(".stake-button").contains("Pending...");
      // Wait for balance to change
      cy.get("#user-balance")
        .not(`:contains(${balance_before_txt})`)
        .then($p => {
          // Check new balance
          const balance_after = ohmRound($p.text());
          expect(balance_after).to.eq(target_balance);
        });
    });
    // TODO
    it(`Unstakes ${STAKE_AMOUNT} sOHM`, () => {
      cy.get("#wallet-button span").contains("Connect Wallet");
      cy.get("#wallet-button").click();
      cy.get(".web3modal-provider-name").contains("MetaMask").click();
      cy.acceptMetamaskAccess();
      cy.get(".stake-button").contains("Approve");
      cy.get("#amount-input").type(STAKE_AMOUNT);
    });
    // TODO
    // it(`disconnects wallet from app`, () => {

    // })

    assert(true);
  });
});
