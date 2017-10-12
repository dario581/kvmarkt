export interface Scheme {
    id?: number;
    title: string;
    description: string;
    content?: string;
    place_name?: string;
    place: number;
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
