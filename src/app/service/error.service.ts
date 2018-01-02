import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DataError } from './data.error';

@Injectable()
export class ErrorService {

  error: DataError;
  subject: Subject<DataError>;

  constructor() {
    this.subject = new Subject();
   }

  setError(type: number) {
    this.error = new DataError(type, 'Oh, leider ist etwas schief gelaufen. Versuche es bald nochmal');

    // this.error.id = type;
    // this.error.message = 'Oh, leider ist etwas schief gelaufen. Versuche es bald nochmal';

    this.subject.next(this.error);
    // subject: Subject<{ id: number, message: string }>;
  }

  // schould error have a timestamp
  getError(): Observable<DataError> {
    return this.subject.asObservable();
  }

}

export const NETWORK_ERROR = 1;
export const Server_ERROR = 2;
