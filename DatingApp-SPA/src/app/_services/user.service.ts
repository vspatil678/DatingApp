import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }

public getUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.baseUrl + 'users');
}

public getUser(id: number): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'users/' + id);
}

public updateUser(id: number, user: User) {
  return this.http.put(this.baseUrl + 'Users/' + id, user);
}

}
