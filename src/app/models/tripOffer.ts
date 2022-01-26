import { BookingClass } from "./bookingClass";
import { Expectation } from "./expectation";

/** Reise Angebot */
export class TripOffer {
  public id: string;
  public titel: string;
  public startbild: any;
  public startDatum: string;
  public endDatum: string;
  public anmeldungsFrist: string;
  public plaetze: number;
  public freiPlaetze: number;
  public leistungen: Array<string>;
  public interessiert: number;
  public mitReiserBerechtigt: string[];
  public hinweise: string;
  public sonstigeHinweise: string;
  public erwartungenReadListTO: Expectation;
  public erwartungen: Expectation;
  public buchungsklassenReadListTO: Array<BookingClass>;
  public buchungsklassen: Array<BookingClass>;
  public landId: string;
  public realImage?: any;
}
