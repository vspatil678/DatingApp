import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public model: any = {};
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  public login() {
    this.authService.login(this.model).subscribe(next => { this.model = next ; console.log('logged in successfuly'); },
    error => { console.log('Failed to login' + error); });
    console.log(this.model);
  }

  public loggedIn() {
    const token = localStorage.getItem('token');
    return !!token; // returns true if we have token else false
  }

  public logOut() {
    localStorage.removeItem('token');
    console.log('log out');
  }

}
