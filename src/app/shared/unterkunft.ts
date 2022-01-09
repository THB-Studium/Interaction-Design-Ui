import { v4 as uuid_v4 } from 'uuid';
import { Accommodation } from "../models/accommodation";

export class Unterkunft {
  public static readonly unterkunft_text: string = 'Wir haben einen besonders guten Übernachtdungsdeal bekommen, weil wir an drei Orten in den Hostels\n' +
    'derselben Betreiber wohnen. In Island haben die Hostels Hotel-Standard, während die Hotels kaum mehr\n' +
    'zu bieten haben, sind diese jedoch unbezahlbar. Darüber hinaus überzeugt mich deren Konzept einer\n' +
    'nachhaltigen und umweltbewussten... Unsere Hostels haben alle einen Aufenthaltsraum, Kochgelegenheit,\n' +
    'eine eigene Bar und oft auch einen Billiardtisch oder andere Angebote, mit denen wir uns gemütliche\n' +
    'Winterabende machen können.';

  public static readonly daten: Array<Accommodation> = [
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Loft-Hostel Reykjavik, insges. 3 Nächte (2 bei Ankunft, 1 vor Abflug)',
      link: 'https://www.hihostels.com/de/hostels/reykjavik-loft-hostel',
      adresse: 'Bankastraeti 7, 101 Reykjavik',
      beschreibung: 'Sehr zentral, super modern und Top-Bewertungen, in Fußlaufweite aller\n' +
        'Sehenswürdigkeiten, im Ausgeh-Vierteil von Reykjavik gelegen. Hat auch eine eigene Bar.\n' +
        'Nachts kann es auch mal lauter werden, Ohropax werden kostenlos ausgeteilt. Im Vergleich\n' +
        'zur Khaosan-Road in Bangkok ist das jedoch ein seichter Witz. Wer unbedingt seine Ruhe\n' +
        'möchte, bucht Doppelzimmer oder Einzelzimmer und gibt mir einen Hinweis. Ich buche\n' +
        'euch dann in ein anderes Hotel in der Nähe ein.',
      bilder: ['1-a.jpg', '1-b.jpg']
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Heradskolinn Laugarvatn, 2 Nächte',
      link: 'https://heradsskolinn.is',
      adresse: 'Bankastraeti 7, 101 Reykjavik',
      beschreibung: 'Das beste Hotel auf unserer Reise, wunderschön gelegen am Laugarvatn-See, der von einer' +
        'heißen Therme gespeist wird (man kann also auch im Winter in den See springen!),' +
        'nebenan gibt es auch eine richtige Therme, um einen Tag so richtig zu entspannen. Man' +
        'kann von hier aus jedoch auch tolle Ausflüge starten. Laugarvatn ist ein toller Punkt, um' +
        'Nordlichter zu beobachten. Wir besuchen hier gemeinsam die geothermale Bäckerei.',
      bilder: ['2-a.jpg', '2-b.jpg']
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Vik Hostel, 2 Nächte',
      link: 'https://www.hostel.is/hostels/vik-hi-hostel',
      adresse: 'Bankastraeti 7, 101 Reykjavik',
      beschreibung: 'Super gemütliches, kleines Hostel am oberen Stadtrand von Vik. Von hier aus kann man zu' +
        'Fuß den Black Sand Beach erreichen oder auf einen Plateuberg steigen, von wo aus man' +
        'einen fast endlosen Blick die Küste entlang hat. Wer möchte kann von hier aus eine Tour' +
        'zum Vulkan Hekla starten, sofern es die Witterung zulässt.',
      bilder: ['3-a.jpg', '3-b.jpg']
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Höfn HI Hostel, 2 Nächte',
      link: 'https://www.hostel.is/hostels/hofn-hi-hostel',
      adresse: 'Hvannabraut 3, 780 Höfn',
      beschreibung: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor' +
        'invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et' +
        'accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata' +
        'sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing' +
        'elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,',
      bilder: ['4-a.jpg', '4-b.jpg']
    },
    {
      id: uuid_v4(),
      landId: uuid_v4(),
      name: 'Selfoss HI Hostel, 1 Nacht',
      link: 'https://www.hostel.is/hostels/selfoss-hi-hostel',
      adresse: 'Austurvegur 28, 800 Selfoss',
      beschreibung: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor' +
        'invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et' +
        'accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata' +
        'sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing' +
        'elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,',
      bilder: ['5-a.jpg', '5-b.jpg']
    },
  ];
}
