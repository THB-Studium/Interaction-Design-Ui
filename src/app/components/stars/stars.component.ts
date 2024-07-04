import {Component, Input, OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-stars',
    templateUrl: './stars.component.html',
    styleUrls: ['./stars.component.css'],
    standalone: true,
    imports: [NgIf, MatIconModule]
})
export class StarsComponent implements OnInit {
  @Input() appreciation: number

  constructor() { }

  ngOnInit(): void {
  }

}
