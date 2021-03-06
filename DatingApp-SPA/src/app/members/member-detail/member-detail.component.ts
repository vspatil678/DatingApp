import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  public user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(
    private userService: UserService,
    private alertIfyService: AlertifyService,
    private routes: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // this.loadUser(); --> this method is not required after using resolver we are getting data from resolver
    this.routes.data.subscribe(data => {
      this.user = data.user; // data.user here user is from resolver
    });

    this.routes.queryParams.subscribe(params => {
      const selectedTab = params.tab;
      this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
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
  }


  public getImages() {
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description,
      });
    }

    return imageUrls;
  }

  public selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  public onScheduleMeeting() {
    this.router.navigate(['/schedule-meeting']);
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
