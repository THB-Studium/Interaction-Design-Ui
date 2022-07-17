/// <reference types="cypress-xpath" />
import {v4 as uuidv4} from 'uuid';


describe('Booking', () => {


  it('Should make a booking with one traveler', () => {

    // go to home page
    cy.visit('http://85.214.194.89/dev/interaction-design-ui/#/');

    cy.url().should('include', 'home');

    cy.wait(5000);

    // select a tripoffer
    cy.get('.mehrErfahren').contains('MEHR ERFAHREN >').click();

    cy.url().should('include', 'learn-more');

    // clic to make a booking
    cy.get('#reserve-place').contains('PLATZ RESERVIEREN >').click();

    // step 1
    cy.get('[formcontrolname="vorname"]').type(uuidv4());

    cy.get('[formcontrolname="nachname"]').type(uuidv4());

    cy.get('[formcontrolname="geburtsdatum"]').type('1994-12-01');

    cy.get('[formcontrolname="postanschrift"]').type('testStr 5, 12345 testStadt');

    cy.get('[formcontrolname="handynummer"]').type('01742324223');

    cy.get('[formcontrolname="email"]').type(uuidv4()+'@test.com');

    cy.get('[formcontrolname="status"]').click();

    cy.get('span[class="mat-option-text"]').contains(" Alumnus").click();

    cy.get('[formcontrolname="hochschule"]').type(uuidv4());

    cy.get('[formcontrolname="studiengang"]').type(uuidv4());

    cy.get('[formcontrolname="arbeitet"]').type(uuidv4());

    cy.get('[formcontrolname="schonTeilgennomem"]').click();

    cy.get('span[class="mat-option-text"]').contains("ja").click();

    cy.get('[formcontrolname="mitMitreiser"]').click();

    cy.get('span[class="mat-option-text"]').contains("Nein").click();

    cy.get('span[class="mat-button-wrapper"]').contains("Weiter").click();

    // step 2
    const date = new Date();
    cy.get('[formcontrolname="datum"]').type(new Date(date.getFullYear()+1, date.getMonth()+4, date.getDay()+17).toString());

    cy.get('[formcontrolname="buchungsklasseId"]').click();

    cy.get('span[class="mat-option-text"]').contains(" Studenten-Tarif ").click();

    cy.get('[formcontrolname="zahlungsmethod"]').click();

    cy.get('span[class="mat-option-text"]').contains(" Einmal ").click();

    cy.get('[formcontrolname="flughafen"]').click();

    cy.get('span[class="mat-option-text"]').contains(" Berlin ").click();

    cy.get('span[class="mat-checkbox-label"]').contains(" Ich habe Handgepäck ").click();

    cy.get('button[type="submit"]').eq(1).click();

    // step 3
    cy.get('strong').contains('Allgemeine Geschäftsbedingungen').click();

    cy.get('button[type="submit"]').eq(2).click();

    cy.get('button[type="submit"]').eq(3).click();

    // done
    //cy.get('button[color="primary"]').eq(7).click();
    //another method
    cy.get('i[class*="fa-file-pdf"]').click();

    cy.wait(5000);

    //close the form
    cy.get('span[class="mat-button-wrapper"]').contains('Schließen').click();

  });

  it('Should make a booking with two travelers', () => {

    // go to home page
    cy.visit('http://85.214.194.89/dev/interaction-design-ui/#/');

    cy.url().should('include', 'home');

    cy.wait(5000);

    // select a tripoffer
    cy.get('.mehrErfahren').contains('MEHR ERFAHREN >').click();

    cy.url().should('include', 'learn-more');

    // clic to make a booking
    cy.get('#reserve-place').contains('PLATZ RESERVIEREN >').click();

    // step 1 -> Traveller
    cy.get('[formcontrolname="vorname"]').type(uuidv4());

    cy.get('[formcontrolname="nachname"]').type(uuidv4());

    cy.get('[formcontrolname="geburtsdatum"]').type('1994-12-01');

    cy.get('[formcontrolname="postanschrift"]').type('testStr 5, 12345 testStadt');

    cy.get('[formcontrolname="handynummer"]').type('01742324223');

    cy.get('[formcontrolname="email"]').type(uuidv4()+'@test.com');

    cy.get('[formcontrolname="status"]').click();

    cy.get('span[class="mat-option-text"]').contains(" Alumnus").click();

    cy.get('[formcontrolname="hochschule"]').type(uuidv4());

    cy.get('[formcontrolname="studiengang"]').type(uuidv4());

    cy.get('[formcontrolname="arbeitet"]').type(uuidv4());

    cy.get('[formcontrolname="schonTeilgennomem"]').click();

    cy.get('span[class="mat-option-text"]').contains("ja").click();

    cy.get('[formcontrolname="mitMitreiser"]').click();

    cy.get('span[class="mat-option-text"]').contains("ja").click();

    cy.get('span[class="mat-button-wrapper"]').contains("Weiter").click();

    // step 2 -> MitTraveller
    cy.get('[formcontrolname="vorname"]').eq(1).type(uuidv4());

    cy.get('[formcontrolname="nachname"]').eq(1).type(uuidv4());

    cy.get('[formcontrolname="geburtsdatum"]').eq(1).type('1994-12-01');

    cy.get('[formcontrolname="postanschrift"]').eq(1).type('testStr 5, 12345 testStadt');

    cy.get('[formcontrolname="handynummer"]').eq(1).type('01742324223');

    cy.get('[formcontrolname="email"]').eq(1).type(uuidv4()+'@test.com');

    cy.get('[formcontrolname="status"]').eq(1).click();

    cy.get('mat-option[value="student"]').click();

    cy.get('[formcontrolname="hochschule"]').eq(1).type(uuidv4());

    cy.get('[formcontrolname="studiengang"]').eq(1).type(uuidv4());

    cy.get('[formcontrolname="schonTeilgennomem"]').eq(1).click();

    cy.get('mat-option[value="true"]').click();

    cy.get('button[class*="mat-stepper-next"]').eq(1).click();


    // step 3
    const date = new Date();
    cy.get('[formcontrolname="datum"]').type(new Date(date.getFullYear()+1, date.getMonth()+4, date.getDay()+17).toString());

    cy.get('[formcontrolname="buchungsklasseId"]').click();

    cy.get('span[class="mat-option-text"]').contains(" Studenten-Tarif ").click();

    cy.get('[formcontrolname="zahlungsmethod"]').click();

    cy.get('span[class="mat-option-text"]').contains(" Einmal ").click();

    cy.get('[formcontrolname="flughafen"]').click();

    cy.get('span[class="mat-option-text"]').contains(" Berlin ").click();

    cy.get('span[class="mat-checkbox-label"]').contains(" Ich habe Handgepäck ").click();

    cy.get('button[type="submit"]').eq(2).click();

    // step 4
    cy.get('strong').contains('Allgemeine Geschäftsbedingungen').click();

    cy.get('button[type="submit"]').eq(3).click();

    cy.get('button[type="submit"]').eq(4).click();

    // done -> download pdf
    //another method
    cy.get('i[class*="fa-file-pdf"]').click();

    cy.wait(5000);

    //close the form
    cy.get('span[class="mat-button-wrapper"]').contains('Schließen').click();

  });

  // TODO: Delete the created booking

})
