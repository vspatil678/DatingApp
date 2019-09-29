import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  public user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(
    private userService: UserService,
    private alertIfyService: AlertifyService,
    private routes: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.loadUser(); --> this method is not required after using resolver we are getting data from resolver
    this.routes.data.subscribe(data => {
      this.user = data.user; // data.user here user is from resolver
    });

    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',
          imagePercent: 100,
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
      } ];

    this.galleryImages = [];
    this.getImages();
  }


  public getImages() {
    const imageUrls = [];
    for (const photo of this.user.Photos) {
      imageUrls.push({
        small: photo.Url,
        medium: photo.Url,
        big: photo.Url,
        description: photo.Description,
      });
    }

    return imageUrls;
  }
  // members/4 the bellow code is used without resolver and we have to use ? like  user?UserName
  // to avoid ? - we have to use resolver
  // public loadUser() {
  //   return this.userService.getUser(+this.routes.snapshot.params.Id).subscribe(
  //     (user: User) => {
  //       this.user = user;
  //     },
  //     error => {
  //       this.alertIfyService.error(error);
  //     }
  //   );
  // }
}
