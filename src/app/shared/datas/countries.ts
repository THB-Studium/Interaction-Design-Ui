import { v4 as uuid_v4 } from 'uuid';
import { Unterkunft } from "./unterkunft";
import { Highlights } from "./highlights";
import { CountryInfos } from "./country-infos";

export class Countries {
  public static readonly data: Array<any> = [
    {
      id: uuid_v4(),
      name: 'Island',
      karte_bild: 'Karte_farbe_2.png',
      flughafen: [
                  'BRB',
                  'BRB_1',
                  'BRB_2',
                  'BRB_3',
                ],
      infosLands: CountryInfos.daten,
      highlights: Highlights.daten,
      unterkunft_text: Unterkunft.unterkunft_text,
      unterkunft: Unterkunft.daten,
    },
    {
      id: uuid_v4(),
      name: 'Georgien & Armenien',
      karte_bild: 'Karte_farbe_2.png',
      flughafen: [
                'BRB',
                'BRB_4',
                'BRB_5',
                'BRB_6',
              ],
      infosLands: CountryInfos.daten,
      highlights: Highlights.daten,
      unterkunft_text: Unterkunft.unterkunft_text,
      unterkunft: Unterkunft.daten,
    },
    {
      id: uuid_v4(),
      name: 'Schottland',
      karte_bild: 'Karte_farbe_2.png',
      flughafen: [
        'BRB',
        'BRB_7',
        'BRB_8',
        'BRB_9',
      ],
      infosLands: CountryInfos.daten,
      highlights: Highlights.daten,
      unterkunft_text: Unterkunft.unterkunft_text,
      unterkunft: Unterkunft.daten,
    },
    {
      id: uuid_v4(),
      name: 'Hawaii',
      karte_bild: 'Karte_farbe_2.png',
      flughafen: [
        'BRB',
        'BRB_10',
        'BRB_11',
        'BRB_12',
      ],
      infosLands: CountryInfos.daten,
      highlights: Highlights.daten,
      unterkunft_text: Unterkunft.unterkunft_text,
      unterkunft: Unterkunft.daten,
    },
  ];
}
