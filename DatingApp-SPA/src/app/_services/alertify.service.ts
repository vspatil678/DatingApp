import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }
 public confirm(message: string, okCallBack: () => any) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        okCallBack();
      } else {

      }
    });
  }

  public success(message: string) {
    alertify.success(message);
  }

  public error(message: string) {
    alertify.error(message);
  }

  public warning(message: string) {
    alertify.warning(message);
  }

  public message(message: string) {
    alertify.message(message);
  }
}
