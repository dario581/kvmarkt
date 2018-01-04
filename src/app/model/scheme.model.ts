import { IBaseObject } from './store/BaseStore';

export interface Scheme extends IBaseObject {
    id: number;
    title: string;
    description: string;
    content?: string;
    place_name?: string;
    place: number;
    place2?: number;
    place3?: number;
    author_name?: string;
    author: number;
    category_name?: string;
    category: number;
    age_start: number;
    age_end: number;
    like_count?: number;
    status: string;
    created?: Date;
    updated?: string;
    isFavorite?: boolean;
}
