import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserForRegistrationDto } from '../models/user-for-registration-dto';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../models/User';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public today: number = Date.now();
  public registrationForm: FormGroup;
  public bsConfig: Partial<BsDatepickerConfig>;
  public user: User;
  @Output() public cancelRegistration = new EventEmitter<boolean>();
  constructor(private authService: AuthService,
              private alertifyservice: AlertifyService,
              private formBuilder: FormBuilder,
              private router: Router) {
                      this.buildRegistrationForm();
                      this.bsConfig = {
                        containerClass: 'theme-red',
                      };
               }

  ngOnInit() {
  }

  public register() {
    if (this.registrationForm.valid) {
      this.user = Object.assign({}, this.registrationForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertifyservice.success('registration successful'); },
       (error: HttpErrorResponse) => {
          this.alertifyservice.error(error.message); },
          () => { this.authService.login(this.user).subscribe(() => {
            this.router.navigate(['/members']);
          }); });
    }
  }

  public cancel() {
    this.cancelRegistration.emit(false);
  }

  private buildRegistrationForm() {
        this.registrationForm = this.formBuilder.group({
          Gender: ['', Validators.required],
          KnownAs: ['', Validators.required],
          DateOfBirth: [''],
          City: ['', Validators.required],
          Country: ['', Validators.required],
          UserName: ['', Validators.required],
          PassWord: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
          ConfirmPassWord: ['', [Validators.required]]
        }, {validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(c: AbstractControl): { invalid: boolean } {
      if (c.get('PassWord').value !== c.get('ConfirmPassWord').value) {
        return {invalid: true};
    }
  }

  private findInvalidControls() {
    const invalid = [];
    const controls = this.registrationForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}

}
