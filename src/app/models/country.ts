import { Accommodation } from "./accommodation";
import { CountryInformation } from "./countryInformation";
import { Highlight } from "./highlight";
import { TripOffer } from "./tripOffer";

export class Country {
  public id: string;
  public name: string;
  public karte_bild: string;
  public flughafen!: string;
  public infosLands: Array<CountryInformation>;
  public highlights: Array<Highlight>;
  public reiseAngebot: Array<TripOffer>;
  public unterkunft_text: string;
  public unterkunft: Array<Accommodation>;
}
