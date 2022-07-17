// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(email: string, password: string): typeof login;
  }
}

function login(email: string, password: string): void {

  cy.visit('http://85.214.194.89/dev/interaction-design-ui/#/verwaltung');

  cy.url().should('include', 'verwaltung');

  cy.get('[formcontrolname="email"]').type(email);

  cy.get('[formcontrolname="pwd"]').type(password);

  cy.get('button').contains('Login').click();

  cy.url().should('include', 'verwaltung');

}
//
// NOTE: You can use it like so:
Cypress.Commands.add('login', login);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
