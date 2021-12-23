import { Accommodation } from "./accommodation";
import { CountryInformation } from "./countryInformation";
import { Highlight } from "./highlight";
import { TripOffer } from "./tripOffer";

export class Country {
  public id: string;
  public name: string;
  public karte_bild: string;
  public klima: string;
  public gesundheit: string;
  public hinweise: string;
  public sonstigeHinweise: string;
  public corona_infos: string;
  public flughafen: Array<string>;
  public reiseOrdnung: string;
  public unterkunft_text: string;
  public mitReiserBerechtigt: Array<string>;
  public infosLands: Array<CountryInformation>;
  public highlights: Array<Highlight>;
  public reiseAngebot: Array<TripOffer>;
  public unterkunft: Array<Accommodation>;
}
