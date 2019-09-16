import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public model: any = {};
  @Output() public cancelRegistration = new EventEmitter<boolean>();
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  public register() {
    this.authService.register(this.model).subscribe(() => { console.log('registration successful'); },
     (error: HttpErrorResponse) => { console.log(error); });
  }

  public cancel() {
    this.cancelRegistration.emit(false);
    console.log('cancelled');
  }

}
