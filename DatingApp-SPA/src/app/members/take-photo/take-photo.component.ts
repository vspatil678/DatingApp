import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamUtil, WebcamInitError } from 'ngx-webcam';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Photo } from 'src/app/models/photo';
import { FileUploader, FileItem } from 'ng2-file-upload';
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

  public onSetAsProfilePhoto() {
    this.alertIfyService.message('this feature not implemented yet.');
    this.dialogRef.close();
  }
}
