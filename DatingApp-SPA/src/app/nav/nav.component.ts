import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { UserForLoginDto } from '../models/user-for-login-dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public loginForm: FormGroup;
  public model: UserForLoginDto;
  public photoUrl: string;
  constructor(public authService: AuthService,
              private alertifyService: AlertifyService,
              private formBuilder: FormBuilder,
              private router: Router) {
                this.buildLoginForm();
              }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  public login(loginDto: UserForLoginDto) {
    this.authService.login(loginDto).subscribe(next => {
    this.alertifyService.success('logged in successfuly'); },
    error => { this.alertifyService.error('Failed to login' + error); console.log(error); },
    () => { this.router.navigate(['/members']); });
  }

  public loggedIn() {
    return this.authService.loggedIn();
    // const token = localStorage.getItem('token');
    // return !!token; // returns true if we have token else false
  }

  public logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertifyService.message('log out');
    this.router.navigate(['/home']);
  }

  private buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      PassWord: ['', Validators.required]
    });
  }

}
