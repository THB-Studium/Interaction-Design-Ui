import { Feedback } from "../../models/feedback";
import { v4 as uuid_v4 } from 'uuid';

export class Feedbacks {
  public static readonly data: Array<Feedback> = [
    {
      id: uuid_v4(),
      description: 'Die Studienreise nach Portugal war wirklich eines der atemberaubendsten\n' +
        'Erlebnisse die ich bisher hatte. Während der vierzehntägigen Reise haben wir\n' +
        'beinahe das ganze Land erkundet, über beeindruckende Natur und volle Städte\n' +
        'war alles dabei. Hinter allen gesammelten Eindrücken steht ein wunderbares\n' +
        'Land, mit großer Geschichte, beeindruckenden Städten mit ihren prachtvollen\n' +
        'Bauwerken und vor allem einer sehr freundlichen Bevölkerung. Die Organisation\n' +
        'der Reise war perfekt und ließe keine Wünsche offen. Gerne wieder!',
      bild: 'fb-1.jpg',
      veroeffentlich: true,
      autor: 'Steven Kranz'
    },
    {
      id: uuid_v4(),
      description: 'Hinter allen gesammelten Eindrücken steht ein wunderbares\n' +
        'Land, mit großer Geschichte, beeindruckenden Städten mit ihren prachtvollen\n' +
        'Bauwerken und vor allem einer sehr freundlichen Bevölkerung. Die Organisation\n' +
        'der Reise war perfekt und ließe keine Wünsche offen. Gerne wieder!',
      bild: 'fb-2.jpg',
      veroeffentlich: true,
      autor: 'Thomas Sankara'
    },
    {
      id: uuid_v4(),
      description: 'Die Organisation der Reise war perfekt und ließe keine Wünsche offen. Gerne wieder!',
      bild: 'fb-3.jpg',
      veroeffentlich: true,
      autor: 'Meriem Makeba'
    },
    {
      id: uuid_v4(),
      description: 'Wahr schlecht mit vielen Wartezeit und Störungen!',
      bild: 'fb-2.jpg',
      veroeffentlich: false,
      autor: 'Meriem Makeba'
    },
  ];
}
