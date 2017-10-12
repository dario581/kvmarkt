import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { User } from '../../model/user.model';
import { BackandService } from '../../service/backand.service';
import { DataError } from '../../service/data.error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string;

  loading = false;

  username = '';
  password = '';
  submited = false;

  constructor(public backandService: BackandService, private router: Router, private authService: AuthService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        this.forbiddenNameValidator(/bob/i)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }


  onSubmit() {
    this.submited = true;
    this.signIn(null);
  }

  signIn(login: any) {
    if ((this.loginForm.get('username').status || this.loginForm.get('password').status) !== 'VALID') {
      if (this.loginForm.get('username').status !== 'VALID') {
        this.errorMessage = 'Login nicht erfolgreich. Falsches Passwort oder falsche E-Mail Adresse. ';
      }
      if (this.loginForm.get('password').status !== 'VALID') {
        this.errorMessage = 'Login nicht erfolgreich. Falsches Passwort oder falsche E-Mail Adresse. ';
      }
      return;
    }
    this.loading = true;
    this.authService.signIn(this.loginForm.get('username').value, this.loginForm.get('password').value).subscribe(
      (data) => {
        let res = data;
        localStorage.setItem('backand_token', res.access_token);
        localStorage.setItem('backand_username', res.username);
        this.getUserInfo();
      },
      (error: DataError) => {
        this.errorMessage = 'Login nicht erfolgreich. Versuche es später erneut.';
        if (error.httpCode === 400) { // Bad Request
          if (error.message === 'invalid_grant') {
            this.errorMessage = 'Login nicht erfolgreich. Falsches Passwort oder falsche E-Mail Adresse. ';
          }
          this.errorMessage = 'Login nicht erfolgreich. Prüfe deine E-Mail-Adresse und dein Passwort. ';
        }
        if (error.httpCode === 401) {
          this.errorMessage = 'Login nicht erfolgreich. Dein . ' +
            'Status: 401 (Unauthorized)';
          this.loading = false;
        }
      }
    );
  }

  getUserInfo() {
    this.backandService.getUser().subscribe(
      data => {
        const userData: User = data;
        localStorage.setItem('backand_user_firstname', userData.firstname);
        localStorage.setItem('backand_user_lastname', userData.lastname);
        localStorage.setItem('backand_user_association', '' + userData.association);
        localStorage.setItem('backand_user_association_name', userData.association_name);
        localStorage.setItem('backand_user_id', '' + userData.id);
        // let redirect = this.backandService.requestedUrl ? this.backandService.requestedUrl : '/dashboard';
        // Redirect the user
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.errorMessage = 'Login nicht erfolgreich. Prüfe deine E-Mail-Adresse und dein Passwort. ' +
          'Es liegt evtl. ein Server-Fehler vor. Versuche es später erneut.' + <any>error;
        this.loading = false;
      }
    );
  }


  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }

}
