import { v4 as uuid_v4 } from 'uuid';
import { Unterkunft } from "./unterkunft";
import { Highlights } from "./highlights";
import { CountryInfos } from "./country-infos";
import { Leistungen } from "./leistungen";
import { BookingClassen } from "./bookingClassen";
import { Country } from "../models/country";

export class Countries {
  public static readonly data: Array<any> = [
    {
      id: uuid_v4(),
      name: 'Island',
      karte_bild: 'Karte_farbe_2.png',
      flughafen: ['BRB'],
      infosLands: CountryInfos.daten,
      highlights: Highlights.daten,
      reiseAngebot: [{
        id: uuid_v4(),
        landId: uuid_v4(),
        title: 'Studienreise „Fire & Ice“ – Island im Winter',
        startbild: 'island.jpg',
        startDatum: new Date('20-02-2022'),
        endDatum: new Date('02-03-2022'),
        anmeldungsFrist: new Date('30-11-2021'),
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
      }],
      unterkunft_text: Unterkunft.unterkunft_text,
      unterkunft: Unterkunft.daten,
    },
    {
      id: uuid_v4(),
      name: 'Georgien & Armenien',
      karte_bild: 'Karte_farbe_2.png',
      flughafen: 'BRB',
      infosLands: CountryInfos.daten,
      highlights: Highlights.daten,
      reiseAngebot: [{
        id: uuid_v4(),
        landId: uuid_v4(),
        title: 'Studienreise - Georgien & Armenien',
        startbild: 'geordian-armenien.jpg',
        startDatum: new Date('2022-08-20'),
        endDatum: new Date('2022-09-05'),
        anmeldungsFrist: new Date('11-2021-11-30'),
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
      }],
      unterkunft_text: Unterkunft.unterkunft_text,
      unterkunft: Unterkunft.daten,
    },
    {
      id: uuid_v4(),
      name: 'Schottland',
      karte_bild: 'Karte_farbe_2.png',
      flughafen: 'BRB',
      infosLands: CountryInfos.daten,
      highlights: Highlights.daten,
      reiseAngebot: [{
        id: uuid_v4(),
        landId: uuid_v4(),
        title: 'Studienreise - Schottland',
        startbild: 'schottland.jpg',
        startDatum: new Date('20-08-2022'),
        endDatum: new Date('05-09-2022'),
        anmeldungsFrist: new Date('30-11-2021'),
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
      }],
      unterkunft_text: Unterkunft.unterkunft_text,
      unterkunft: Unterkunft.daten,
    },
    {
      id: uuid_v4(),
      name: 'Hawaii',
      karte_bild: 'Karte_farbe_2.png',
      flughafen: ['BRB'],
      infosLands: CountryInfos.daten,
      highlights: Highlights.daten,
      reiseAngebot: [{
        id: uuid_v4(),
        landId: uuid_v4(),
        title: 'Studienreise - Hawaii',
        startbild: 'hawaii.jpg',
        startDatum: new Date('20-08-2024'),
        endDatum: new Date('05-09-2024'),
        anmeldungsFrist: new Date('30-11-2022'),
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
      }],
      unterkunft_text: Unterkunft.unterkunft_text,
      unterkunft: Unterkunft.daten,
    },
  ];
}
