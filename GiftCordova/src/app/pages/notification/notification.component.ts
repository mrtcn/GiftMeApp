import { Component, ViewChild, Input } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { NotificationService } from './../../services/notification/notification.service';
import { NotificationViewModel } from './../../services/notification/notification.model';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'notification',
  templateUrl: 'notification.html'
})
export class NotificationComponent {

  private _notifications = new BehaviorSubject<NotificationViewModel[]>(null);
  notifications = this._notifications.asObservable();

  isNotificationIconHidden: boolean = false;
  isAddFriendIconHidden: boolean = false;
  isSearchIconHidden: boolean = true;
  isAddIconHidden: boolean = false;


    constructor(
      private navCtrl: NavController,
      private notificationService: NotificationService,
      private events: Events) {
      this.getNotificationList();
    }

    getNotificationList() {
      this.notificationService.getNotifications().subscribe(x => {
        this._notifications.next(x);
        this.events.publish('toolbarUpdate');
      });
    }  
}
