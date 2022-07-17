describe('Subscribe to Newsletter', () => {

  it('Should not subscribe if the email is invalid', () => {

    cy.visit('http://85.214.194.89/dev/interaction-design-ui/#/');

    cy.url().should('include', 'home');

    cy.get('.form-control').type('admin');

    cy.get('button').contains('ABONNIEREN').should('be.disabled');

  });

  it('Should subscribe if the email is valid', () => {

    cy.visit('http://85.214.194.89/dev/interaction-design-ui/#/');

    cy.url().should('include', 'home');

    cy.get('.form-control').type('vovejat142@bamibi.com');

    cy.get('button').contains('ABONNIEREN').should('not.be.disabled');

    cy.get('button').contains('ABONNIEREN').click();

  });

  it('Should not subscribe if the email allready subscribed', () => {

    cy.visit('http://85.214.194.89/dev/interaction-design-ui/#/');

    cy.url().should('include', 'home');

    cy.get('.form-control').type('vovejat142@bamibi.com');

    cy.get('button').contains('ABONNIEREN').should('not.be.disabled');

    cy.get('button').contains('ABONNIEREN').click();

  });

})
