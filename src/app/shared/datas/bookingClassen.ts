import { v4 as uuid_v4 } from 'uuid';
import {BookingClass} from "../../models/bookingClass";
import {Countries} from "./countries";

export class BookingClassen {
  public static readonly daten: Array<BookingClass> = [
    {
      id: uuid_v4(),
      type: 'studenten-tarif*',
      preis: 1195,
      description: 'Unterkunft im (gemischten) Mehrbettzimmer mit Gemeinschaftsbad\n' +
        '(nur für die Reisegruppe, Hygienemaßnahmen werden eingehalten)',
      reiseAngebotId: Countries.data[0].id
    },
    {
      id: uuid_v4(),
      type: 'standard-tarif',
      preis: 1395,
      description: 'Unterkunft im Mehrbettzimmer mit Gemeinschaftsbad ' +
        '(nur für die Reisegruppe, Hygienemaßnahmen werden eingehalten)',
      reiseAngebotId: Countries.data[0].id
    },
    {
      id: uuid_v4(),
      type: 'comfort-doppelzimmer',
      preis: 1495,
      description: 'mit privatem Bad (Zimmerpartner muss angegeben werden)',
      reiseAngebotId: Countries.data[0].id
    },
    {
      id: uuid_v4(),
      type: 'comfort-einzelzimmer',
      preis: 1695,
      description: 'mit privatem Bad',
      reiseAngebotId: Countries.data[0].id
    },
  ];
}
