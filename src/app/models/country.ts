import { Accommodation } from "./accommodation";
import { CountryInformation } from "./countryInformation";
import { Highlight } from "./highlight";
import { TripOffer } from "./tripOffer";

export class Country {
  public id: string;
  public name: string;
  public flughafen: Array<string>;
  public highlights: Array<Highlight>;
  public unterkunft: Array<Accommodation>;
  public infosLands: Array<CountryInformation>;
  //public karte_bild: string;
  //public klima: string;
  //public gesundheit: string;
  //public hinweise: string;
  //public sonstigeHinweise: string;
  //public corona_infos: string;
  //public reiseOrdnung: string;
  //public unterkunft_text: string;
  //public mitReiserBerechtigt: Array<string>;
  //public reiseAngebot: Array<TripOffer>;
}
