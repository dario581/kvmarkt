import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { User } from '../../model/user.model';
import { DataError } from '../../service/data.error';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    errorMessage: string;
    infoMessage: string;

    loading = false;

    private username = '';
    private password = '';

    constructor(private router: Router, private authService: AuthService) {
        this.loginForm = new FormGroup({
            username: new FormControl('', [
                Validators.required
                // TODO: Check for email pattern
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(6)
            ])
        });
    }

    ngOnInit() {
        if (this.authService.hasCredentialsSet()) {
            this.router.navigate(['/dashboard']);
        }
        this.infoMessage = this.authService.screenMessage;
    }

    signIn() {
        this.infoMessage = null;
        if ((this.loginForm.get('username').status || this.loginForm.get('password').status) !== 'VALID') {
            this.errorMessage = 'Bitte gib eine gültige E-Mail Adresse und ein Passwort ein.';
            // if (this.loginForm.get('username').status !== 'VALID') {
            //   this.errorMessage = 'Login nicht erfolgreich. Falsches Passwort oder falsche E-Mail Adresse. ';
            // }
            // if (this.loginForm.get('password').status !== 'VALID') {
            //   this.errorMessage = 'Login nicht erfolgreich. Falsches Passwort oder falsche E-Mail Adresse. ';
            // }
            return;
        }
        this.loading = true;
        this.authService.signIn(this.loginForm.get('username').value, this.loginForm.get('password').value)
            .subscribe(
                (data) => {
                    this.loading = false;
                    this.runNavigation();
                },
                (error: DataError) => {
                    this.errorMessage = 'Login nicht erfolgreich. Versuche es später erneut.';
                    /* if (error.httpCode === 400) { // Bad Request
                    } */
                    if (error.httpCode === 401 || error.httpCode === 400) {
                        this.errorMessage = 'Login nicht erfolgreich. Prüfe deine E-Mail-Adresse und dein Passwort. ';
                    }
                    this.loading = false;
                }
            );
    }

    private runNavigation() {
        const defaultPath = '/';
        const requestedPath = this.authService.requestedUrl;
        const path = requestedPath && requestedPath !== '/login' ? requestedPath : defaultPath;
        console.log('[debug] path after login', requestedPath);
        this.router.navigateByUrl(path);
    }

}
