import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ErrorService {

  error: {id: number, message: string};
  subject: Subject<{ id: number, message: string }>;

  constructor() {
    this.subject = new Subject();
   }

  setError(type: number) {
    this.error = {
      id: type,
      message: 'Oh, leider ist etwas schief gelaufen. Versuche es bald nochmal'
    };
    if (type === 2) {
      this.error = {
        id: type,
        message: 'Oh, leider ist etwas schief gelaufen SERVER. Versuche es bald nochmal'
      };
    }

    // this.error.id = type;
    // this.error.message = 'Oh, leider ist etwas schief gelaufen. Versuche es bald nochmal';

    this.subject.next(this.error);
    // subject: Subject<{ id: number, message: string }>;
  }

  // schould error have a timestamp
  getError(): Observable<{ id: number, message: string }> {
    return this.subject.asObservable();
  }

}

export const NETWORK_ERROR = 1;
export const Server_ERROR = 2;
