import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService} from '@auth0/angular-jwt';
import { UserForLoginDto } from '../models/user-for-login-dto';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
private baseUrl = 'https://localhost:44373/api/auth';
public jwtHelper = new JwtHelperService();
public decodedToken: any;
constructor(private http: HttpClient) { }
headers = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
public login(model: any) {
  const userForLoginDto = new UserForLoginDto();
  userForLoginDto.UserName = model.UserName;
  userForLoginDto.PassWord = model.PassWord;
  return this.http.post( this.baseUrl + '/login', userForLoginDto,  this.headers).pipe(map((response: any) => {
    const user = response;
    if (user) {
      localStorage.setItem('token', user.token);
      this.decodedToken = this.jwtHelper.decodeToken(user.token);
      console.log(this.decodedToken);
    }
  }));
}

public register(model: any) {
  return this.http.post(this.baseUrl + '/register', model);
}

public loggedIn() {
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}

}
