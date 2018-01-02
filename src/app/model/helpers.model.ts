import { IBaseObject } from './store/BaseStore';

export interface Category extends IBaseObject {
    id?: number;
    name: string;
}
