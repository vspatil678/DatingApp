import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamUtil, WebcamInitError } from 'ngx-webcam';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Photo } from 'src/app/models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';

const baseUrl = environment.apiUrl;
@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.component.html',
  styleUrls: ['./take-photo.component.css']
})
export class TakePhotoComponent implements OnInit {

  public photos: Photo[];
  public uploader: FileUploader;
  public trigger: Subject<void> = new Subject<void>();
  public webcamImage: WebcamImage = null;
  public multipleWebcamsAvailable = false;
  public currentMainPhoto: Photo;
  constructor(private dialogRef: MatDialogRef<TakePhotoComponent>,
              private alertIfyService: AlertifyService,
              private userService: UserService,
              private authService: AuthService) { }
  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public onCloseCamera() {
    this.dialogRef.close();
  }

  public onTakePhoto() {
      this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      this.alertIfyService.error('Camera access was not allowed by user!');
    }
    this.alertIfyService.error(error.message);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public onTryNewPhoto() {
    this.webcamImage = null;
  }

  public onSetAsProfilePhoto(photoToSet: Photo) {
    this.uploader = new FileUploader({
      url: baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          Id: res.Id,
          Url: res.Url,
          Description: res.Description,
          DateAdded: res.DateAdded,
          IsMain: res.IsMain,
        };
        this.photos.push(photo);
        if (photo.IsMain) {
          this.authService.changeMemberPhoto(photo.Url);
          this.authService.currentUser.PhotoUrl = photo.Url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
      }
    };
    //   this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.Id).subscribe(
  //     (next) => { this.alertIfyService.success('successfully set to main photo');
  //                 this.currentMainPhoto = this.photos.filter( p => p.IsMain === true) [0];
  //                 this.currentMainPhoto.IsMain = false;
  //                 photo.IsMain = true;
  //                 // this.getMemberPhotoChange.emit(photo.Url); // not required
  //                 this.authService.changeMemberPhoto(photo.Url);
  //                 this.authService.currentUser.PhotoUrl = photo.Url;
  //                 localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
  //   },
  //     (error) => { this.alertIfyService.error(error); }
  //   );
  // }
  }
}
