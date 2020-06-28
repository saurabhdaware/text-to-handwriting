/// <reference types="cypress" />

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false
})

context('Generate Image', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it('should generate multiple outputs and remove them if user clicks delete', () => {
    cy.get('button[data-testid=generate-image-button]').click();
    cy.get('#output').children().should('have.length', 1);
    cy.get('button[data-testid=generate-image-button]').click();
    cy.get('#output').children().should('have.length', 2);

    // remove images
    cy.get('.output-image-container button.close-button.close-0').click();
    cy.get('#output').children().should('have.length', 1);
  })

  it('should add paper margin when paper margin toggle is clicked', () => {
    cy.get('.left-margin').should('be.visible');
    cy.get('.top-margin').should('be.visible');
    cy.get("label[for='paper-margin-toggle']").click();
    cy.get('.left-margin').should('not.be.visible');
    cy.get('.top-margin').should('not.be.visible');
  })

  it('should have lines class when paper lines toggle is on', () => {
    cy.get('.page-a').should('have.class', "lines");
    cy.get("label[for='paper-line-toggle']").click();
    cy.get('.page-a').should('not.have.class', "lines");
    cy.get("label[for='paper-line-toggle']").click();
    cy.get('.page-a').should('have.class', "lines");
  })

})
