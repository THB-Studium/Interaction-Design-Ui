export class FaktenCheck {
  public static readonly sonstigeHinweise = [
    {
      type: 'Wichtiger Hinweis:',
      description: 'du möchtest lieber nur mit deinem Geschlecht in einem Zimmer schlafen, bist' +
        'nachtaktiv, bist geräuschempfindlich (ein Schnarcher!), geruchsempfindlich (Käsefüße!) oder hast' +
        'Eigenheiten (ich schlafe gern bei offenem Fenster, ich muss immer die Heizung auf höchster Stufe' +
        'haben etc.) oder hast sonstige Eigenheiten … wenn auch nur einer dieser Punkte auf dich zutrifft,' +
        'buche bitte ein Doppelzimmer mit eine*m Gleichgesinnten oder ein Einzelzimmer!',
    },
    {
      type: 'Hinweis Studenten-Tarif:',
      description: 'gültig für immatrikulierte Studierende sowie Absolventen, die unter die Einkommensgrenze der geringfügigen' +
        'Beschäftigung fallen, z.B. Praktikanten, Mini- und Midijobs sowie Arbeitslosigkeit.',
    }
  ];

  public static readonly mitReiserBerechtigt = [
    'Studenten*innen (aktuelle Immatrikulation bei Anmeldung vorweisen)',
    'Hochschulmitarbeiter*innen',
    'Personen, die auf der Reise eine Funktion innehaben (Tourguide, Workshop-Leiter, etc.)',
    'Alumni, die zu Studentenzeiten bereits auf einer Reise dabei waren.'
  ];
}
