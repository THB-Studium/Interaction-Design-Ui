import { v4 as uuid_v4 } from 'uuid';
import { Highlight } from "../models/highlight";

export class Highlights {
  public static readonly daten: Array<any> = [
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Blaue Lagune',
      description: 'Islands inoffizieller Nationalsport ist das' +
        'Herumplanschen in einem Überangebot an geothermischem Wasser. Wir besuchen die Königin' +
        'der Thermalbäder, die Blaue Lagune. Im Winter ist das Bad nicht so überfüllt und mit Schnee und Eis' +
        'ringsum ein besonderes Erlebnis.',
      bild: 'blaue-lagune.jpg'
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Jökursalon',
      description: 'Riesige blaue Eisberge treiben in einer spiegelglatten Lagune dem Meer entgegen. Diese' +
        'surreale Szene ist perfekte Kulisse für Fotografen und Filmemacher (Batman Begins, James Bond) zu' +
        'unserer Reisezeit sind keine Bootsfahrten möglich, wir machen einen Spaziergang am Ufer entlang.',
      bild: 'joekursalon.jpg'
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Polarlicht',
      description: 'Jeder will es erleben, das berühmte Polarlicht, das lange Winternächte in natürliche Lava-Lampen' +
        'verwandelt. Es gehört auch eine gute Portion Glück dazu, aber grundsätzlich besteht in unserem' +
        'reisezeitraum und dem dunklen Himmel eine gute Chance, den Lichtzauber zu sehen.',
      bild: 'polarlicht.jpg'
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Reykjavik',
      description: 'Die nördlichste Hauptstadt der Welt ist ein Mix aus bunten Häusern, einem eigenwilligen,' +
        'kreativen Menschenschlag, Design und Architektur und einem ausschweifenden Nachtleben. Für seine' +
        'geringe Größe ist Reykjavík erstaunlich weltmännisch, voller Kunst und kulinarischer' +
        'Highlights mit viel Sinn für Ästhetik. Inmitten von schneebedeckten Gipfeln, rauer See und' +
        'kristallklarer Luft werden wir die Stadt nun auch im Winter kennenlernen dürfen.',
      bild: 'reykjavik.jpg'
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Vulkan Hekla & Katla',
      description: 'Wie bösen Stiefschwestern aus einem isländischen Märchen spucken die beiden Vulkane Hekla und' +
        'Katla im Süden Islands bis heute Feuer und drohen gern mit Dampf und Rauch und bringen Gletscher' +
        'zum Schmelzen. In einer separaten tour fahren wir – sofern es die Witterung zulässt – zu einem der' +
        'beiden zu Besuch und wagen einen Blick in den hitzigen Krater.',
      bild: 'vulkan-hekia-and-katla.jpg'
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Geysir',
      description: 'Der große Geysir spuckt nur alle 80 Jahre Wasser, dann aber ist die Fontäne 120 Meter hoch. Der' +
        'etwas kleinere Stokkur schießt alle 15 Minuten in die Höhe, ist aber auch als kleiner Bruder sehr' +
        'beeindruckend. Das gesamte geothermale Gebiet rund um den Geysir brodelt, blubbert und kocht' +
        'und es ist faszinierend, wie kochende Flüsse zwischen gelb-blauen Steinen und Eisschollen' +
        'durchfließen. Hier bekommt das Motto unserer Reise „Fire & Ice“ richtig sinn.',
      bild: 'geysir.jpg'
    },
  ];
}
