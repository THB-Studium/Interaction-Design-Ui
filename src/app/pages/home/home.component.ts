import { Component, OnInit } from '@angular/core';

interface Slide {
  image: string;
  alt: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  slideList: Slide[];
  private title: string;
  private description: string;

  constructor() {
    this.title = '>>together around the World<<';
    this.description = 'Wir bieten Studienreisen für studierende und Hochschulmitglied an, die Bildung und Reiseabenteuer in Backpacker-Mentalität miteinander verbinden.';

    this.slideList = [
      {
        image: '../../../assets/carousel/pexels-belle-co-1000445.jpg',
        alt: 'Slide 1',
        title: this.title,
        description: this.description
      },
      {
        image: '../../../assets/carousel/ibrahim-rifath-Y6tBl0pTe-g-unsplash.jpg',
        alt: 'Slide 1',
        title: this.title,
        description: this.description
      }
    ];
  }

  ngOnInit(): void {
  }

}
