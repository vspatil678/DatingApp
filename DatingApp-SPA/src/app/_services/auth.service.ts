import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
private baseUrl = 'https://localhost:44373/api/auth';
constructor(private http: HttpClient) { }

public login(model: any) {
  return this.http.post( this.baseUrl + '/login', model).pipe(map((response: any) => {
    const user = response;
    if (user) {
      localStorage.setItem('token', user.token);
    }
  }));
}

public register(model: any) {
  return this.http.post(this.baseUrl + '/register', model);
}

}
