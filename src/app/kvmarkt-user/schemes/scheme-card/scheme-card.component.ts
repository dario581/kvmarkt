import { Component, Input, OnInit } from '@angular/core';
import { Scheme } from '../../../model/scheme.model';

@Component({
  selector: 'app-scheme-card',
  templateUrl: './scheme-card.component.html',
  styleUrls: [ './scheme-card.component.css' ]
})
export class SchemeCardComponent implements OnInit {

  @Input('scheme') scheme: Scheme = {
    id: -1,
    title: 'Test Card',
    description: 'Lorem ipsum dolor set amet. Lorem ipsum dolor set amet. Eine kurze Beschreibung des Programms.',
    place: 0,
    placeName: 'Sporthalle',
    author: 0,
    authorName: 'Max Mustermann',
    category: 0,
    categoryName: 'Hausspiel',
    ageStart: 1,
    ageEnd: 12,
    status: 'published'
  };

  @Input('border') border = true;

  constructor() { }

  ngOnInit() {
  }

}
