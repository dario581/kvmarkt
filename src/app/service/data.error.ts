
export class DataError implements Error {
    name = 'NetworkError';
    message = '';
    stack?: string;

    httpCode: number;

    constructor(httpCode: number, message?: string) {
        this.httpCode = httpCode;
        this.message = message || '';
    }

}
