import { Component, OnInit, HostListener } from '@angular/core';
import { User } from 'src/app/models/User';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  public user: User;
  public userEditForm: FormGroup;
  public photoUrl: string;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.userEditForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(private route: ActivatedRoute,
              private alertifyService: AlertifyService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private router: Router ) {
                this.buildUserEditForm();
               }

  ngOnInit() {
    this.route.data.subscribe(data => {
       this.user = data.user;
       if (this.user) {
          this.setValues(this.user);
        }
    }, error => {
      this.alertifyService.error(error);
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl =>  this.photoUrl = photoUrl);
  }

  private buildUserEditForm() {
    this.userEditForm = this.formBuilder.group({
      Id: [''],
      UserName: [''],
      KnownAs: [''],
      Age: [''],
      Gender: [''],
      Created: [''],
      LastActive: [''],
      PhotoUrl: [''],
      Photos: [''],
      Introduction: [''],
      LookingFor: [''],
      Interests: [''],
      City: [''],
      Country: ['']
    });
  }

  private setValues(userData: User) {
    this.userEditForm.patchValue({
      Id: userData.id,
      UserName: userData.userName,
      KnownAs: userData.knownAs,
      Age: userData.age,
      Gender: userData.gender,
      Created: userData.created,
      LastActive: userData.lastActive,
      PhotoUrl: userData.photoUrl,
      Introduction: userData.introduction,
      LookingFor: userData.lookingFor,
      Interests: userData.interests,
      City: userData.city,
      Country: userData.country,
      Photos: userData.photos
    });
  }

  public updateUserInfo(userInfo: User) {
    this.userService.updateUser(this.authService.decodedToken.nameid , userInfo).subscribe( (next) => {
      this.alertifyService.success('Profile updated successfully.');
      this.userEditForm.reset();
      this.router.navigate(['/members']);
    }, (error) => {
      this.alertifyService.error(error);
     });
  }

  public updateMainPhoto(photoUrl) {
      this.user.photoUrl = photoUrl;
  }

}

