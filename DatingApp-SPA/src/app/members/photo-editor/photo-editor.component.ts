import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { TakePhotoComponent } from '../take-photo/take-photo.component';
import { MatDialog } from '@angular/material/dialog';

const baseUrl = environment.apiUrl;
@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new  EventEmitter<string>();
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public currentMainPhoto: Photo;
  constructor(private authService: AuthService,
              private userService: UserService,
              private alertifyService: AlertifyService,
              private matDailog: MatDialog) { }

  ngOnInit() {
    this.initializeUploader();
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  private initializeUploader() {
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
          id: res.id,
          url: res.url,
          description: res.description,
          dateAdded: res.dateAdded,
          isMain: res.isMain,
          isApproved: res.isApproved,
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
      }
    };
  }

  public setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(
      (next) => { this.alertifyService.success('successfully set to main photo');
                  this.currentMainPhoto = this.photos.filter( p => p.isMain === true) [0];
                  this.currentMainPhoto.isMain = false;
                  photo.isMain = true;
                  this.getMemberPhotoChange.emit(photo.url); // not required
                  this.authService.changeMemberPhoto(photo.url);
                  this.authService.currentUser.photoUrl = photo.url;
                  localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    },
      (error) => { this.alertifyService.error(error); }
    );
  }

  public onPhotoDelete(photoId: number) {
         this.alertifyService.confirm('Are you sure you want to delete this photo?', () => {
         this.userService.deletePhoto(this.authService.decodedToken.nameid, photoId).subscribe(() => {
         this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
         this.alertifyService.success('photo deleted successfully');
         }, (error) => { this.alertifyService.error('Fail to delete photo' + error); });
         });
  }

  public onOpenCamera() {
    const modalRef =  this.matDailog.open(TakePhotoComponent);
    modalRef.componentInstance.photos = this.photos;
  }

}
