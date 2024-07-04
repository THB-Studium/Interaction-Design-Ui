import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.css'],
    standalone: true
})
export class SpinnerComponent implements OnInit {
  @Input() dataName: string = ''

  constructor() { }

  ngOnInit(): void {
  }

}
