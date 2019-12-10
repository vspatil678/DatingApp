import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {

  public photos: any;

  constructor(
    private adminService: AdminService,
    private alertIfyService: AlertifyService) { }

  ngOnInit() {
    this.getPhotosForApproval();
  }

  public getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe((photos) => {
      this.photos = photos;
    }, (error) => {
      this.alertIfyService.error(error);
    });
  }

  public approvePhoto(photoId) {
    this.adminService.approvePhoto(photoId).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
    }, (error) => {
      this.alertIfyService.error(error);
    });
  }

  public rejectPhoto(photoId) {
    this.adminService.rejectPhoto(photoId).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
    }, (error) => {
      this.alertIfyService.error(error);
    });
  }

}
