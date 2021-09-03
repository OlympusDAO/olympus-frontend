describe("stake tets", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("navigates to the staking page", () => {
    expect(true).to.equal(true);
    cy.get("#stake-nav").click();
    cy.location().should(location => {
      expect(location.href).to.eq("http://localhost:3000/#/stake");
    });
  });
});
