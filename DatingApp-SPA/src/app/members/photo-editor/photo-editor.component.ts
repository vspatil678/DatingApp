import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

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
              private alertifyService: AlertifyService) { }

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
  }

  public setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.Id).subscribe(
      (next) => { this.alertifyService.success('successfully set to main photo');
                  this.currentMainPhoto = this.photos.filter( p => p.IsMain === true) [0];
                  this.currentMainPhoto.IsMain = false;
                  photo.IsMain = true;
                  this.getMemberPhotoChange.emit(photo.Url); // not required
                  this.authService.changeMemberPhoto(photo.Url);
                  this.authService.currentUser.PhotoUrl = photo.Url;
                  localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    },
      (error) => { this.alertifyService.error(error); }
    );
  }

  public onPhotoDelete(photoId: number) {
         this.alertifyService.confirm('Are you sure you want to delete this photo?', () => {
         this.userService.deletePhoto(this.authService.decodedToken.nameid, photoId).subscribe(() => {
         this.photos.splice(this.photos.findIndex(p => p.Id === photoId), 1);
         this.alertifyService.success('photo deleted successfully');
         }, (error) => { this.alertifyService.error('Fail to delete photo' + error); });
         });
  }

}
