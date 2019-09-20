import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertifyService } from '../_services/alertify.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public model: any = {};
  @Output() public cancelRegistration = new EventEmitter<boolean>();
  constructor(private authService: AuthService,
              private alertifyservice: AlertifyService) { }

  ngOnInit() {
  }

  public register() {
    this.authService.register(this.model).subscribe(() => {
      this.alertifyservice.success('registration successful'); },
     (error: HttpErrorResponse) => {
        this.alertifyservice.error(error.message); });
  }

  public cancel() {
    this.cancelRegistration.emit(false);
    console.log('cancelled');
  }

}
