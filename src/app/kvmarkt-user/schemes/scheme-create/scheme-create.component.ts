import { Component, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ErrorService, NETWORK_ERROR } from '../../../service/error.service';
import { Scheme } from '../../../model/scheme.model';
import { CategoryStore, PlaceStore } from '../../../model/store';
import { Category, Place } from '../../../model/helpers.model';

@Component({
  selector: 'app-scheme-create',
  templateUrl: './scheme-create.component.html',
  styleUrls: ['./scheme-create.component.css']
})
export class SchemeCreateComponent implements OnInit {

  schemeForm: FormGroup;

  constructor(
    private errorService: ErrorService,
    private categoryStore: CategoryStore,
    private placeStore: PlaceStore,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  // error = '';

  // editorText: string;
  // editorPlaceholder = 'Hier kannst du ausführlich dein Programm beschreiben.';
  // editor: any;

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
  scheme_categories: Category[] = [];
  scheme_places: Place[] = [];
  scheme_ages: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  placeholderTitle = 'Programmname';
  placeholderDescription = 'Gib hier eine kurze Beschreibung ein, um direkt zu sehen, worum es in deinem Programm geht.';

  scheme: Scheme = {
    id: null,
    title: this.placeholderTitle,
    description: this.placeholderDescription,
    content: '',
    placeName: null,
    place: 0,
    place2: 0,
    place3: 0,
    authorName: null,
    author: null,
    category: 0,
    ageStart: 0,
    ageEnd: 0,
    likeCount: null,
    status: 'unknown'
  };

  ngOnInit() {
    this.categoryStore.getItems().subscribe(data => this.setSchemeCategories(data));
    this.placeStore.getItems().subscribe(data => this.setSchemePlaces(data));
  }

  // forbiddenEmailPatternValidator(nameRe: RegExp): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } => {
  //     const forbidden = nameRe.test(control.value);
  //     return forbidden ? { 'forbiddenEmailPattern': { value: control.value } } : null;
  //   };
  // }

  // forbiddenSelectorValidator(id: number): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } => {
  //     return id === 0 ? { 'forbittenSelectorValue': { value: control.value } } : null;
  //   };
  // }


  createForm() {
    this.schemeForm = this.formBuilder.group({
      title:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60),
        this.forbiddenStringValidator(this.placeholderTitle)] ],
      category:     ['', [Validators.required, this.forbiddenSelectorValidator()]],
      description:  ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3), Validators.maxLength(500),
        this.forbiddenStringValidator(this.placeholderDescription) ]],
      content:      ['', Validators.minLength(40)],
      age_start:    ['', [Validators.required]],
      age_end:      ['', [Validators.required, this.forbiddenSelectorValidator()]],
      place:        ['', [Validators.required, this.forbiddenSelectorValidator()]],
      place2:       ['' ],
      place3:       ['' ],
    }, { validator: this.forbiddenAgeValidator() });

    this.schemeForm.setValue({
      title: this.scheme.title,
      category: this.scheme.category,
      description: this.scheme.description,
      content: this.scheme.content,
      age_start: this.scheme.ageStart,
      age_end: this.scheme.ageEnd,
      place: this.scheme.place,
      place2: this.scheme.place2,
      place3: this.scheme.place3,
    });
  }

  forbiddenStringValidator(placeholder: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = control.value === placeholder;
      return forbidden ? { 'forbiddenStringValue': { value: control.value } } : null;
    };
  }

  /**
   * Check if option 0 (default) is selected
   */
  forbiddenSelectorValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return +control.value === 0 ? { 'forbittenSelectorValue': { value: control.value } } : null;
    };
  }
  forbiddenAgeValidator(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const input = group.controls['age_start'];
      input.setErrors(input.validator(input));
      return +group.controls['age_start'].value > +group.controls['age_end'].value ?
        { 'forbittenSelectorValue': { value: +group.controls['age_start'].value } } : null;
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



  private setSchemeCategories(data: Category[]) {
    this.scheme_categories = [{ name: 'Kategorie wählen', id: 0 }];
    this.scheme_categories = this.scheme_categories.concat(data);
  }

  private setSchemePlaces(data: Place[]) {
    this.scheme_places = [{ name: 'Ort wählen', id: 0 }];
    this.scheme_places = this.scheme_places.concat(data);
  }

  submit() {
    this.scheme.status = 'published';
    const scheme: Scheme = {
      id: null,
      author: null,
      status: null,
      title: this.schemeForm.value.title,
      description: this.schemeForm.value.description,
      content: this.schemeForm.value.content,
      category: this.schemeForm.value.category,
      ageStart: this.schemeForm.value.age_start,
      ageEnd: this.schemeForm.value.age_end,
      place: this.schemeForm.value.place,
      place2: this.schemeForm.value.place2 > 0 ? this.schemeForm.value.place2 : undefined,
      place3: this.schemeForm.value.place3 > 0 ? this.schemeForm.value.place3 : undefined
    };
    // TODO: Add saving of scheme
    // this.backandService.addScheme(scheme).subscribe((data: any) => {
    //   console.log('scheme create save');
    // });
  }


}
