import { IBaseObject } from './store';

export interface Category extends IBaseObject {
    id?: number;
    name: string;
}

export interface Place extends IBaseObject {
    name: string;
}

