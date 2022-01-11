import { Accommodation } from "./accommodation";
import { CountryInformation } from "./countryInformation";
import { Highlight } from "./highlight";

export class Country {
  public id: string;
  public name: string;
  public flughafen: Array<string>;
  public unterkunft_text: string;
  public karte_bild: File;
  public landInfo: CountryInformation[];
  public highlights: Highlight[];
  public unterkunft: Accommodation[];
  public realImage?: any;
}
