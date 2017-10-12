import { Component, Input, OnInit } from '@angular/core';
import { Scheme } from '../../../model/scheme.model';

@Component({
  selector: 'app-scheme-card',
  templateUrl: './scheme-card.component.html',
  styleUrls: [ './scheme-card.component.css' ]
})
export class SchemeCardComponent implements OnInit {

  @Input('scheme') scheme: Scheme = {
    title: 'Test Card',
    description: 'Lorem ipsum dolor set amet. Lorem ipsum dolor set amet. Eine kurze Beschreibung des Programms.',
    place: 0,
    place_name: 'Sporthalle',
    author: 0,
    author_name: 'Max Mustermann',
    category: 0,
    category_name: 'Hausspiel',
    age_start: 1,
    age_end: 12,
    status: 'published'
  };

  @Input('border') border = true;

  constructor() { }

  ngOnInit() {
  }

}
