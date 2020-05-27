/// <reference types="cypress" />

context('PDF Preview', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it('should toggle display of pdf-preview-container', () => {
    cy.get('#pdf-preview-button').click();
    cy.get('.pdf-preview-container').should('be.visible');
    cy.get('.pdf-preview-container .close-button').click();
    cy.get('.pdf-preview-container').should('not.be.visible');
  });

  it('should show the added images in preview-holder', () => {
    for (let i = 0; i < 3; i++) {
      cy.get('button.primary-button[type=submit]').click();
      cy.wait(100);
    }

    cy.get('#pdf-preview-button').click();

    for (let i = 0; i < 3; i++) {
      cy.get('.image-'+i).should('exist');
    }
  })
});

