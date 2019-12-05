import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService} from '@auth0/angular-jwt';
import { UserForLoginDto } from '../models/user-for-login-dto';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';
import { BehaviorSubject } from 'rxjs';
import { UserForRegistrationDto } from '../models/user-for-registration-dto';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
private baseUrl = environment.apiUrl + 'auth';
public jwtHelper = new JwtHelperService();
public decodedToken: any;
public currentUser: User;
public photoUrl = new BehaviorSubject<string>('../../assets/user.png');
public currentPhotoUrl = this.photoUrl.asObservable();
constructor(private http: HttpClient) { }
headers = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};

public changeMemberPhoto(photoUrl: string) {
  this.photoUrl.next(photoUrl);
}
public login(model: any) {
  const userForLoginDto = new UserForLoginDto();
  userForLoginDto.UserName = model.UserName;
  userForLoginDto.PassWord = model.PassWord;
  return this.http.post( this.baseUrl + '/login', userForLoginDto,  this.headers).pipe(map((response: any) => {
    const user = response;
    if (user) {
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user.user));
      this.decodedToken = this.jwtHelper.decodeToken(user.token);
      this.currentUser = user.user;
      this.changeMemberPhoto(this.currentUser.photoUrl);
     // console.log(this.decodedToken);
    }
  }));
}

public register(user: User) {
  return this.http.post(this.baseUrl + '/register', user);
}

public loggedIn() {
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}

roleMatch(allowedRoles): boolean {
  let isMatch = false;
  const userRoles = this.decodedToken.role as Array<string>;
  console.log(userRoles);
  if (userRoles && userRoles.length) {
    allowedRoles.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
   }
  return isMatch;
}

}
