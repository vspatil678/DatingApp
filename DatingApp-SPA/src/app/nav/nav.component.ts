import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { UserForLoginDto } from '../models/user-for-login-dto';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public loginForm: FormGroup;
  public model: UserForLoginDto;
  constructor(public authService: AuthService,
              private alertifyService: AlertifyService,
              private formBuilder: FormBuilder) {
                this.buildLoginForm();
              }

  ngOnInit() {
  }

  public login(loginDto: UserForLoginDto) {
    this.authService.login(loginDto).subscribe(next => {
    this.alertifyService.success('logged in successfuly'); },
    error => { this.alertifyService.error('Failed to login' + error); console.log(error); });
  }

  public loggedIn() {
    return this.authService.loggedIn();
    // const token = localStorage.getItem('token');
    // return !!token; // returns true if we have token else false
  }

  public logOut() {
    localStorage.removeItem('token');
    this.alertifyService.message('log out');
  }

  private buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      UserName: [''],
      PassWord: ['']
    });
  }

}
