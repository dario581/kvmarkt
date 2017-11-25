import { Component, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorService, NETWORK_ERROR } from '../../../service/error.service';

@Component({
  selector: 'app-scheme-create',
  templateUrl: './scheme-create.component.html',
  styleUrls: ['./scheme-create.component.css']
})
export class SchemeCreateComponent implements OnInit {

  constructor(private errorService: ErrorService) { }
  error = '';

  ngOnInit() {
    this.errorService.getError().subscribe( (error) => {
      this.error = error.message;
    });
    this.errorService.setError(NETWORK_ERROR);
    setTimeout(() => {
      this.errorService.setError(2);
    }, 2000);
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

}
