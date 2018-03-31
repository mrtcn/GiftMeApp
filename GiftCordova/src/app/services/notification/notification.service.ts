import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { AccountService } from '../../auth/shared/account.service';
import { HttpResponseSuccessModel, HttpResponseErrorModel } from './../../interceptors/http.model';
import { InterceptedHttp } from '../../interceptors/http.interceptor';
import { NotificationViewModel, NotificationStatusType } from './notification.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NotificationService {
  constructor(
    private accountService: AccountService,
    private http: InterceptedHttp
  ) {

  }

  public getNotifications(): Observable<NotificationViewModel[]> {
    var notificationListMap = this.http.authorizedPost("api/Notification/NotificationList", null, null).map((res: Response) => {
      let notifications: HttpResponseSuccessModel = res.json();
      return notifications.content;
    });

    var updateNotificationsAsReadMap = this.http.authorizedPost("api/Notification/UpdateNotificationsAsRead", null, null).map((res: Response) => {
      let notifications: HttpResponseSuccessModel = res.json();
      return notifications.content;
    }).delay(500);

    return Observable.concat(notificationListMap, updateNotificationsAsReadMap);
  }

  public NotDisplayedNotificationCount(): Observable<number> {
    return this.http.authorizedPost("api/Notification/NotDisplayedNotificationCount", null, null).map((res: Response) => {
      let notifications: HttpResponseSuccessModel = res.json();
      return notifications.content;
    });    
  }
}
