import { Photo } from './photo';

export interface User {
    Id: number;
    UserName: string;
    KnownAs: string;
    Age: number;
    Gender: string;
    Created: Date;
    LastActive: Date;
    PhotoUrl: string;
    City: string;
    Country: string;
    Interests?: string;
    Introduction?: string;
    LookingFor?: string;
    Photos?: Photo[];
}
