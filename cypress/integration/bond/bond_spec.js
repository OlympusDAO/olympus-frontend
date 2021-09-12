describe("bond tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("navigates to the bonds page", () => {
    cy.get("#bond-nav").click();
    cy.location().should(location => {
      expect(location.href).to.eq("http://localhost:3000/#/bonds");
    });
  });
});
