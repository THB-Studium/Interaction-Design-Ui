import {v4 as uuidv4} from 'uuid';

const email = 'aaaa11112'+uuidv4()+'@test.cm';

describe('Users', () => {

  it('Should get all users in Dashboard', () => {

    cy.login('admin@local.com', 'testtest');

    cy.url().should('include', 'verwaltung');

    cy.wait(3000);

    cy.get('em[class="fa fa-users mr-3 text-primary"]').click();

  });

  it('Should add a user in Dashboard', () => {

    cy.url().should('include', 'users');

    cy.wait(3000);

    cy.get('em[class="fa fa-users mr-3 text-primary"]').click();

    cy.get('mat-icon[class="mat-icon notranslate material-icons mat-icon-no-color"]').click();

    cy.get('[formcontrolname="firstname"]').type(uuidv4());

    cy.get('[formcontrolname="lastname"]').type(uuidv4());

    cy.get('[formcontrolname="email"]').type(email);

    cy.get('[formcontrolname="pwd"]').type('12345678');

    cy.get('[formcontrolname="pwdRepeat"]').type('12345678');

    //speichern
    cy.get('button[color="primary"]').eq(1).click();

    cy.wait(3000);

  });

  it('Should delete the added user in Dashboard', () => {

    cy.url().should('include', 'users');

    cy.reload();

    cy.login('admin@local.com', 'testtest');

    cy.get('em[class="fa fa-users mr-3 text-primary"]').click();

    cy.wait(2000);

    cy.get('em[class="fa fa-trash text-red"]').eq(0).click();

    cy.get('button[color="primary"] > span[class="mat-button-wrapper"]').contains('Ja').click();

    cy.wait(3000);

  });

})
