import { v4 as uuid_v4 } from 'uuid';
import { Leistungen } from "./leistungen";
import { BookingClassen } from "./bookingClassen";
import { Countries } from "./countries";

export class TripOffers {
  public static readonly data: Array<any> = [
    {
      id: uuid_v4(),
      landId: Countries.data[0].id,
      titel: 'Studienreise „Fire & Ice“ – Island im Winter',
      startbild: 'island.jpg',
      startDatum: buildDate(20, 2, 2022),
      endDatum: buildDate(2, 3, 2022),
      anmeldungsFrist: buildDate(30, 11, 2021),
      plaetze: 40,
      freiPlaetze: 35,
      interessiert: 28,
      leistungen: Leistungen.daten,
      erwartungenReadListTO: {
        id: uuid_v4(),
        reiseAngebotId: uuid_v4(),
        abenteuer: 4,
        entschleunigung: 5,
        konfort: 5,
        nachhaltigkeit: 4,
        sicherheit: 5,
        sonne_strand: 1,
        road: 4,
      },
      buchungsklassenReadListTO: BookingClassen.daten,
    },
    {
      id: uuid_v4(),
      landId: Countries.data[1].id,
      titel: 'Studienreise - Georgien & Armenien',
      startbild: 'geordian-armenien.jpg',
      startDatum: buildDate(20, 8, 2022),
      endDatum: buildDate(5, 9, 2022),
      anmeldungsFrist: buildDate(30, 11, 2021),
      plaetze: 20,
      freiPlaetze: 20,
      interessiert: 25,
      leistungen: Leistungen.daten,
      erwartungenReadListTO: {
        id: uuid_v4(),
        abenteuer: 4,
        entschleunigung: 5,
        konfort: 5,
        nachhaltigkeit: 4,
        sicherheit: 5,
        sonne_strand: 1,
        road: 4,
        reiseAngebotId: uuid_v4(),
      },
      buchungsklassenReadListTO: BookingClassen.daten,
    },
    {
      id: uuid_v4(),
      landId: Countries.data[2].id,
      titel: 'Studienreise - Schottland',
      startbild: 'schottland.jpg',
      startDatum: buildDate(20, 8, 2022),
      endDatum: buildDate(5, 9, 2022),
      anmeldungsFrist: buildDate(30, 11, 2021),
      plaetze: 20,
      freiPlaetze: 15,
      interessiert: 32,
      leistungen: Leistungen.daten,
      erwartungenReadListTO: {
        id: uuid_v4(),
        abenteuer: 4,
        entschleunigung: 5,
        konfort: 5,
        nachhaltigkeit: 4,
        sicherheit: 5,
        sonne_strand: 1,
        road: 4,
        reiseAngebotId: uuid_v4(),
      },
      buchungsklassenReadListTO: BookingClassen.daten,
    },
    {
      id: uuid_v4(),
      landId: Countries.data[3].id,
      titel: 'Studienreise - Hawaii',
      startbild: 'hawaii.jpg',
      startDatum: buildDate(20, 8, 2024),
      endDatum: buildDate(5, 9, 2024),
      anmeldungsFrist: buildDate(30, 11, 2022),
      plaetze: 32,
      freiPlaetze: 2,
      interessiert: 40,
      leistungen: Leistungen.daten,
      erwartungenReadListTO: {
        id: uuid_v4(),
        abenteuer: 5,
        entschleunigung: 5,
        konfort: 5,
        nachhaltigkeit: 4,
        sicherheit: 4,
        sonne_strand: 5,
        road: 4,
        reiseAngebotId: uuid_v4(),
      },
      buchungsklassenReadListTO: BookingClassen.daten,
    }
  ];
}

function buildDate(day: number, month: number, year: number): Date {
  const date: Date = new Date()
  date.setFullYear(year, month, day);
  return date;
}
