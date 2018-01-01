import { Component, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorService, NETWORK_ERROR } from '../../../service/error.service';
import { BackandService } from '../../../service/backand.service';
import { Scheme } from '../../../model/scheme.model';

@Component({
  selector: 'app-scheme-create',
  templateUrl: './scheme-create.component.html',
  styleUrls: ['./scheme-create.component.css']
})
export class SchemeCreateComponent implements OnInit {

  constructor(private errorService: ErrorService, private backandService: BackandService) { }
  error = '';

  editorText: string;
  editorPlaceholder = 'Hier kannst du ausführlich dein Programm beschreiben.';
  editor: any;

  // quillModules: { [index: string]: Object } = {
  //   toolbar: [
  //     ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  //     [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  //     ['clean'],                                         // remove formatting button
  //     ['link']                         // link and image, video
  //   ]
  // };

  private scheme_tags: Array<{ name: string, id: number }> = [];
  scheme_categories: Array<{ name: string, id: number }> = [];
  scheme_places: Array<{ name: string, id: number }> = [];
  scheme_ages: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  scheme: Scheme = {
    id: null,
    title: 'Programmname',
    description: 'Gib hier eine kurze Beschreibung ein, um direkt zu sehen, worum es in deinem Programm geht.',
    content: '',
    place_name: null,
    place: 0,
    author_name: null,
    author: null,
    category: 0,
    age_start: 0,
    age_end: 0,
    like_count: null,
    status: 'unknown'
  };

  ngOnInit() {
    this.errorService.getError().subscribe( (error) => {
      this.error = error.message;
    });
    this.errorService.setError(NETWORK_ERROR);
    setTimeout(() => {
      this.errorService.setError(2);
    }, 2000);
    this.backandService.getCategories().subscribe(data => this.setSchemeCategories(data));
    this.backandService.getTags().subscribe((data: any) => this.scheme_tags = data);
    this.backandService.getPlaces().subscribe(data => this.setSchemePlaces(data));
  }

  forbiddenEmailPatternValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenEmailPattern': { value: control.value } } : null;
    };
  }

  forbiddenSelectorValidator(id: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return id === 0 ? { 'forbittenSelectorValue': { value: control.value } } : null;
    };
  }


  // froalaOptions: any = {
  //   height: 600,
  //   toolbarStickyOffset: 56,
  //   toolbarButtons: [
  //     'bold',
  //     'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'paragraphFormat',
  //     'formatOL', 'formatUL', 'quote', 'insertHR', '-', 'undo', 'redo', 'clearFormatting', 'selectAll'
  //   ],
  //   /*toolbarButtonsMD: ['fullscreen'],
  //   toolbarButtonsSM: ['fullscreen']*/
  // };



  private setSchemeCategories(data: Array<{ name: string, id: number }>) {
    this.scheme_categories = [{ name: 'Kategorie wählen', id: 0 }];
    this.scheme_categories = this.scheme_categories.concat(data);
  }

  private setSchemePlaces(data: Array<{ name: string, id: number }>) {
    this.scheme_places = [{ name: 'Ort wählen', id: 0 }];
    this.scheme_places = this.scheme_places.concat(data);
  }

  submit() {
    console.log('scheme create save');
    this.scheme.status = 'published';
    this.backandService.addScheme(this.scheme).subscribe((data: any) => {
      this.backandService.addSchemeTags(data.id, [1, 2]).subscribe((data2: any) => console.log(data2));
    });
  }


}
