describe("stake tests", () => {
  beforeEach(() => {
    cy.setupMetamask();
    //cy.changeMetamaskNetwork("rinkeby");
    cy.visit("/");
  });
  it("navigates to the staking page", () => {
    cy.get("#stake-nav").click();
    cy.location().should(location => {
      expect(location.href).to.eq("http://localhost:3000/#/stake");
    });
  });
  it("checks that apy, tvl, and current index exist", () => {
    // this test doesnt really do much and should always pass
    cy.get(".stake-apy").should("exist");
    cy.get(".stake-tvl").should("exist");
    cy.get(".stake-index").should("exist");
  });
  it("Connects MetaMask", () => {
    cy.get("#wallet-button").click();
    cy.get(".web3modal-provider-name").contains("MetaMask").click();
    cy.acceptMetamaskAccess();
  });
});
