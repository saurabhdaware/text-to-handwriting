/// <reference types="cypress" />

context('Generate Image', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it('should generate output when generate image is clicked', () => {
    cy.get('button.primary-button[type=submit]').click();
    cy.get('#output').should('not.be.empty');
  })

  it('should add paper margin when paper margin toggle is clicked', () => {
    cy.get("label[for='paper-margin-toggle']").click();
    cy.get('.paper-margin-left-line').should('be.visible');
    cy.get('.paper-margin-top-line').should('be.visible');
  })

  it('should have lines class when paper lines toggle is on', () => {
    cy.get('.page > .textarea').should('have.class', "lines");
    cy.get("label[for='paper-line-toggle']").click();
    cy.get('.page > .textarea').should('not.have.class', "lines");
    cy.get("label[for='paper-line-toggle']").click();
    cy.get('.page > .textarea').should('have.class', "lines");
  })

})
