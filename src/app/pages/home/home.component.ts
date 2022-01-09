import { Component, OnInit } from '@angular/core';
import { Country } from "../../models/country";
import { Countries } from "../../shared/countries";
import { SlideList } from "../../shared/slideList";
import { Slide } from "../../models/slide";
import { format } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  slideList: Array<Slide>;
  reiseAngebot: Array<Country>

  constructor() {
    this.slideList = SlideList.daten;
    this.reiseAngebot = Countries.data;
  }

  ngOnInit(): void {
    console.log(this.reiseAngebot)
  }

  formatDate(date: Date): string {
    // const dateToString = format(date, 'dd.MMM.yyyy').split('.')
    // return dateToString[0] + '.' + dateToString[1] + ' - '
    return ' - '
  }

  setBackground(img: string): string {
    let backGround = "background-size: contain; background-repeat: no-repeat; background-size: 100% 100%;"
    return backGround += "background-image: url('assets/img/travel-offer/" + img + "')"

  }

}
