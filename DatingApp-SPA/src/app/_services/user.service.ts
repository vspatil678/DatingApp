import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/User';
import { PaginatedResult } from '../models/Pagination';
import { map, catchError } from 'rxjs/operators';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }

headers = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};

public getUsers(page?, itemsPerPage?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {
  const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
  let params: HttpParams = new HttpParams();
  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }

  if (userParams != null) {
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

  }

  if (likesParam === 'Likers') {
    params = params.append('likers', 'true');
  }

  if (likesParam === 'Likees') {
    params = params.append('likees', 'true');
  }

  return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params}).pipe(
    map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination')) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    })
  );
}

public getUser(id: number): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'users/' + id);
}

public updateUser(id: number, user: User) {
  return this.http.put(this.baseUrl + 'Users/' + id, user);
}

public setMainPhoto(userId: number, photoId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + photoId + '/setMain', {});
}

public deletePhoto(userId: number, photoId: number) {
  return this.http.delete( this.baseUrl + 'users/' + userId + '/photos/' + photoId );
}

public sendLike(id: number, recipientId: number) {
  return this.http.post( this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
}

public getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
  const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
  let params: HttpParams = new HttpParams();
  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }
  params = params.append('MessageContainer', messageContainer);

  return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', { observe: 'response', params}).pipe(
    map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination') !== null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    })
  );
}

public getMessageThread(userId: number, recipientId: number) {
  return this.http.get<Message[]>(this.baseUrl + 'users/' + userId + '/Messages' + '/thread/' + recipientId);
}

public sendMessage(userId: number, message: Message) {
 return this.http.post(this.baseUrl + 'users/' + userId + '/Messages', message);
}

public deleteMessage(id: number, userId: number) {
  return this.http.post(this.baseUrl + 'users/' + userId + '/Messages/' + id, {});
}

public markMessageAsRead(userId: number, id: number) {
  return this.http.post(this.baseUrl + 'users/' + userId + '/Messages/' + id + '/read' , {});
}

public uploadCameraClickedPhoto(userId: number, cameraImage: any) {
  this.headers.headers.append('Content-Disposition', 'multipart/form-data');
  const reader = new FileReader();
  console.log(cameraImage);
  console.log(typeof(cameraImage));
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + 'photoFromCamera', JSON.stringify(cameraImage), this.headers).pipe(
    catchError(this.handleError)
  );
}

handleError(error) {
  let errorMessage = '';
  if (error.error instanceof ErrorEvent) {
    // client-side error
    errorMessage = `Error: ${error.error.message}`;
  } else {
    // server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  window.alert(errorMessage);
  return throwError(errorMessage);
}
}
