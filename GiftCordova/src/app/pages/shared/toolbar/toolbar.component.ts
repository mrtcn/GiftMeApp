import { Keyboard } from 'ionic-native';
import { NavController, Searchbar, Events } from 'ionic-angular';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { CreateEventComponent } from '../../event/create-event/create-event.component';
import { NotificationComponent } from '../../notification/notification.component';
import { FriendManagementComponent } from '../../friend-management/friend.management.component';

import { FriendManagementService } from '../../../services/friend-management/friend.management.service';
import { FriendManagementViewModel, FriendManagementModel, FriendshipListViewModel, FriendshipStatus } from '../../../services/friend-management/friend.management.model';

import { NotificationService } from '../../../services/notification/notification.service';
import { NotificationViewModel, NotificationStatusType } from '../../../services/notification/notification.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var cordova: any;

@Component({
    selector: 'toolbar',
    styleUrls: ['/toolbar.scss'],
    templateUrl: 'toolbar.html',
    providers: [Keyboard]
})
export class ToolbarComponent implements OnInit {

    @Input() isNotificationIconHidden: boolean;
    @Input() isAddFriendIconHidden: boolean;
    @Input() isSearchIconHidden: boolean;
    @Input() isAddIconHidden: boolean;
    @Output() searchAction = new EventEmitter<string>();

    searchTerm: string = '';
    isSearchbarOn: boolean = true;

    private _unreadNotificationCount = new BehaviorSubject<number>(0);
    private unreadNotificationCount = this._unreadNotificationCount.asObservable();

    private _friendshipRequestCount = new BehaviorSubject<number>(0);
    private friendshipRequestCount = this._friendshipRequestCount.asObservable();

    @ViewChild('searchbar') searchbar: Searchbar;

    constructor(
      private friendManagementService: FriendManagementService,
      private notificationService: NotificationService,
      private navCtrl: NavController,
      private events: Events
    ) {

      this.notificationService.NotDisplayedNotificationCount()
        .subscribe((x: number) => {
          console.log("NotDisplayedNotificationCount subscribe = " + JSON.stringify(x));

          this._unreadNotificationCount.next(x);
        });

      this.friendManagementService.receivedFriendshipRequestCount(null).subscribe(x => {
        this._friendshipRequestCount.next(x);
      });

      this.events.subscribe('toolbarUpdate', (searchTerm) => {
        this.notificationService.NotDisplayedNotificationCount()
          .subscribe((x: number) => {
            console.log("toolbarUpdate NotDisplayedNotificationCount subscribe = " + JSON.stringify(x));

            this._unreadNotificationCount.next(x);
          });

        this.friendManagementService.receivedFriendshipRequestCount(null).subscribe(x => {
          console.log("toolbarUpdate receivedFriendshipRequestCount subscribe = " + JSON.stringify(x));
          this._friendshipRequestCount.next(x);
        })
      });
    }

    ngOnInit() {
    }

    searchActionEventEmitter() {
      this.searchAction.emit(this.searchTerm);
    }

    toggleSearchbar() {
      console.log("toggleSearchbar");
      this.searchTerm = '';
      this.isSearchbarOn = !this.isSearchbarOn;

      this.searchAction.emit(null);

      if (this.isSearchbarOn) {
        Keyboard.close();
      } else {
        setTimeout(() => {
          this.searchbar.setFocus();
        }, 250)

        Keyboard.show();
      }
    }

    addEvent() {
      console.log("addEvent = ");
      this.navCtrl.push(CreateEventComponent);
    }

    navigateToNotifications() {
      this.navCtrl.push(NotificationComponent);
    }

    navigateToFriendManagement() {
      this.navCtrl.push(FriendManagementComponent);
    }
}
