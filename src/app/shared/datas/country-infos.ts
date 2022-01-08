import { v4 as uuid_v4 } from 'uuid';
import { CountryInformation } from "../../models/countryInformation";

export class CountryInfos {
  public static readonly daten: Array<CountryInformation> = [
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      titel: 'Corona-Info & Sonderregelung Stornierung',
      description: 'Sollte uns kurz vor Abreise eine coronabedingte Einreisebeschränkung treffen, verschiebt sich die Reise um genau 1 Jahr. Eure Buchung bleibt damit bestehen, es sei denn ihr\n' +
        'tretet schriftlich von dieser zurück. Einbezahlte Gelder werden ohne Abzug rückerstattet.\n' +
        'Die aktuelle Reisekalkulation geht davon aus, dass zum Reisezeitraum Flüge im normalen Preissegment zur Verfügung stehen. Aktuell gibt es kaum Flugverbindungen nach\n' +
        'Reykjavik und die Fluglinien garantieren keinen Transport sowie mangels Auslastung behalten sie sich vor, Flüge zu stornieren. Sollte der Flugpreis für das Gruppen-ticket 500\n' +
        'Euro übersteigen, wird der Reisepreis steigen. In diesem Falle hat jeder selbstverständlich ein kostenloses Rücktrittsrecht von der Reise. Bitte frühzeitig Gedanken machen was\n' +
        'passiert, sollte man die Rückreise erst ein – zwei Tage später antreten können. Die zusätzlichen Übernachtungen übernimmt die Reisekasse, zahlt jedoch keine Entschädigungen.\n' +
        'Auf der gesamten Reise werden die Corona-Empfehlungen des Reiselandes eingehalten. Die von uns gebuchten Schlafsäle und dazugehörigen sanitären Anlagen sind\n' +
        'ausschließlich für unsere Reisegruppe reserviert. Wiir reisen in einem Privatbus, der nur der Gruppe vorbehalten ist. In Island lassen sich Abstandregeln problemlos einhalten.'
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      titel: 'Klima / Ausrüstung',
      description: 'Nicht vorhanden!'
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      titel: 'Gesundheit',
      description: 'Nicht vorhanden!'
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      titel: 'ReiseOrdnung',
      description: 'Nicht vorhanden!'
    },
  ];
}
