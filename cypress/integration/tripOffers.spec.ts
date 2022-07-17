describe('Tripoffers', () => {

  // it('Should get tripoffer from header', () => {

  //   cy.visit('http://85.214.194.89/dev/interaction-design-ui/#/');

  //   cy.url().should('include', 'home');

  //   cy.get('span').contains('Direkt Buchen').click();

  //   cy.wait(4000);

  //   cy.get('.mat-select-placeholder').click();

  //   cy.get('input[placeholder="Suche"]').type('geor');

  //   cy.get('mat-option[role="option"]').eq(0).click();

  //   cy.get('span[class*="mat-button-focus-overlay"]').eq(0).click();

  //   cy.url().should('include', 'learn-more');

  // });

  it('Should get tripoffer from homepage', () => {

    cy.visit('http://85.214.194.89/dev/interaction-design-ui/#/');

    cy.url().should('include', 'home');

    cy.wait(9000);

    cy.get('.mehrErfahren').contains('MEHR ERFAHREN >').click();

    cy.url().should('include', 'learn-more');

  });

  it('Should add tripoffer', () => {

    cy.login('admin@local.com', 'testtest');

    // wip

  });
})
