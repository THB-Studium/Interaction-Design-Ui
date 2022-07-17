describe('Login', () => {

  it('Should not login if the form is not valid', () => {

    cy.visit('http://85.214.194.89/dev/interaction-design-ui/#/verwaltung');

    cy.url().should('include', 'verwaltung');

    cy.get('[formcontrolname="email"]').type('admin');

    cy.get('button').contains('Login').click();

    cy.url().should('include', 'verwaltung');
  });

  it('Should login if the form is not valid', () => {

    // cy.visit('http://85.214.194.89/dev/interaction-design-ui/#/verwaltung');

    // cy.url().should('include', 'verwaltung');

    // cy.get('[formcontrolname="email"]').type('admin@local.com');

    // cy.get('[formcontrolname="pwd"]').type('testtest');

    // cy.get('button').contains('Login').click();

    // cy.url().should('include', 'verwaltung');

    cy.login('admin@local.com', 'testtest');
  });

})
