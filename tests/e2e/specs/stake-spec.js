var STAKE_AMOUNT = 0.1;
describe("Stake tests", () => {
  beforeEach(() => {
    cy.visit("/#/");
  });
  it(`Stake ${STAKE_AMOUNT} OHM`, () => {
    cy.get("#wallet-button").click();
    cy.get(".web3modal-provider-name").contains("MetaMask").click();
    cy.acceptMetamaskAccess();
    cy.get("#amount-input").type(STAKE_AMOUNT);
    // Approve spend limit
    cy.get(".stake-button").click();
    cy.confirmMetamaskPermissionToSpend();
    // Stake and check that balance changed accordingly
    cy.get("#user-balance").then($p => {
      const balance_before = $p.text();
      // Stake
      cy.get(".stake-button").click();
      cy.confirmMetamaskTransaction();
      // Wait for balance to change
      cy.get("#user-balance")
        .not(`:contains(${balance_before})`)
        .then($p => {
          const balance_after = $p.text();
          expect(parseFloat(balance_after)).to.eq(parseFloat(balance_before) - STAKE_AMOUNT);
        });
    });

    assert(true);
  });
});
