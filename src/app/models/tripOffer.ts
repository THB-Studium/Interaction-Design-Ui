import { BookingClass } from "./bookingClass";
import { Expectation } from "./expectation";

/** Reise Angebot */
export class TripOffer {
  public id: string;
  public titel: string;
  public startbild: string;
  public startDatum: Date;
  public endDatum: Date;
  public anmeldungsFrist: Date;
  public plaetze: number;
  public freiPlaetze: number;
  public leistungen: Array<string>;
  public interessiert: number;
  public erwartungenReadListTO: Expectation;
  public buchungsklassenReadListTO: Array<BookingClass>;
  public landId: string;
}
