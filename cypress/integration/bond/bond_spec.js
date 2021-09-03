describe("bond tets", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("navigates to the bonds page", () => {
    expect(true).to.equal(true);
    cy.get("#bond-nav").click();
    cy.location().should(location => {
      expect(location.href).to.eq("http://localhost:3000/#/bonds");
    });
  });
});
