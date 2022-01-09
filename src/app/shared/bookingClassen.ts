import { v4 as uuid_v4 } from 'uuid';
import {BookingClass} from "../models/bookingClass";

export class BookingClassen {
  public static readonly daten: Array<BookingClass> = [
    {
      id: uuid_v4(),
      type: 'studenten-tarif',
      preis: 1195,
      reiseAngebotId: uuid_v4()
    },
    {
      id: uuid_v4(),
      type: 'standard-tarif',
      preis: 1395,
      reiseAngebotId: uuid_v4()
    },
    {
      id: uuid_v4(),
      type: 'comfort-doppelzimmer',
      preis: 1495,
      reiseAngebotId: uuid_v4()
    },
    {
      id: uuid_v4(),
      type: 'comfort-einzelzimmer',
      preis: 1695,
      reiseAngebotId: uuid_v4()
    },
  ];
}
