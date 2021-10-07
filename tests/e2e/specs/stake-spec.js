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
      cy.log($p.text());
      const balance_before_txt = $p.text();
      cy.log(balance_before_txt);
      const target_balance = ohmRound(ohmRound(balance_before_txt) - STAKE_AMOUNT);
      // Stake
      cy.get(".stake-button").contains("Stake OHM");
      cy.get(".stake-button").click();
      cy.confirmMetamaskTransaction();
      cy.get("#wallet-button").contains("In progress");
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
    assert(true);
  });
  it(`Unstakes ${STAKE_AMOUNT} sOHM`, () => {
    cy.get("#wallet-button span").contains("Connect Wallet");
    cy.get("#wallet-button").click();
    cy.get(".web3modal-provider-name").contains("MetaMask").click();
    // cy.acceptMetamaskAccess();
    cy.get("#simple-tab-1").click();
    cy.get(".stake-button").contains("Approve");
    cy.get("#amount-input").type(STAKE_AMOUNT);
    cy.get(".stake-button").click();
    cy.confirmMetamaskPermissionToSpend();
    // Unstake
    cy.get("#user-balance").then($p => {
      cy.log($p.text());
      const balance_before_txt = $p.text();
      const target_balance = ohmRound(ohmRound(balance_before_txt) + STAKE_AMOUNT);
      // Wait for balance to change
      cy.get(".stake-button").contains("Unstake OHM");
      cy.get(".stake-button").click();
      cy.confirmMetamaskTransaction();
      cy.get("#wallet-button").contains("In progress");
      cy.get(".stake-button").contains("Pending...");
      cy.get("#user-balance")
        .not(`:contains(${balance_before_txt})`)
        .then($p => {
          // Check new balance
          const balance_after = ohmRound($p.text());
          expect(balance_after).to.eq(target_balance);
        });
    });
    assert(true);
  });
});
