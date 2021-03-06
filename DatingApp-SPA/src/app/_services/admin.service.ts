import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';

const baseUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class AdminService {

constructor(
  private http: HttpClient,
  ) { }


  public getUsersWithRoles() {
    return this.http.get(baseUrl + 'admin/usersWithRoles');
  }

  public updateUserRoles(user: User, roles: {}) {
    return this.http.post(baseUrl + 'admin/editRoles/' + user.userName, roles);
  }

  public getPhotosForApproval() {
    return this.http.get(baseUrl + 'admin/photosForModeration');
  }

  public approvePhoto(photoId) {
    return this.http.post(baseUrl + 'admin/approvePhoto/' + photoId, {});
  }

  public rejectPhoto(photoId) {
    return this.http.post(baseUrl + 'admin/rejectPhoto/' + photoId, {});
  }

}
