import { Facebook, NativeStorage, Keyboard } from 'ionic-native';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Events, Searchbar, NavController, App } from 'ionic-angular';
import { AuthComponent } from '../../auth/auth.component';
import { CreateEventComponent } from '../event/create-event/create-event.component';
import { NotificationComponent } from '../notification/notification.component';
import { AccountService } from '../../auth/shared/account.service';
import { FriendManagementService } from '../../services/friend-management/friend.management.service';
import { FriendManagementViewModel, FriendManagementModel, FriendshipStatus, FriendshipListViewModel } from '../../services/friend-management/friend.management.model';
import { ProfilePage } from '../../pages/profile/profile.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'friend.management',
  styleUrls: ['/friend.management.scss'],
  templateUrl: 'friend.management.html',
  providers: [Keyboard]
})
export class FriendManagementComponent implements OnInit {
  private _friendshipList = new BehaviorSubject<Array<FriendManagementViewModel>>(null);
  public friendshipList = this._friendshipList.asObservable();

  private _userList = new BehaviorSubject<Array<FriendManagementViewModel>>(null);
  public userList = this._userList.asObservable();

  searchTerm: string = '';

  @ViewChild('searchbar') searchbar: Searchbar;

  isNotificationIconHidden: boolean = false;
  isAddFriendIconHidden: boolean = false;
  isSearchIconHidden: boolean = true;
  isAddIconHidden: boolean = false;

  constructor(
    private accountService: AccountService,
    private navCtrl: NavController,
    private friendManagementService: FriendManagementService,
    private events: Events,
    private app: App
  ) {
    this.waitingFriendshipRequestList(new FriendshipListViewModel(null, null, null));
  }

  ngOnInit() {
  }

  onLink(url: string) {
    window.open(url);
  }

  addEvent() {
    this.navCtrl.push(CreateEventComponent);
  }

  searchUserName() {
    this.friendManagementService.searchUser(this.searchTerm).subscribe((x: FriendManagementViewModel[]) => {
      console.log("searchUserName friendshipList json = " + JSON.stringify(x));
      this._userList.next(x);
    }, error => {
      console.log("SearchUser Error = " + JSON.stringify(error));
    });
  }

  navigateToNotifications() {
    this.navCtrl.push(NotificationComponent);
  }

  handleFriendshipStatus(friendShipRequest: number, friendId: number) {
    console.log("Friendship Request Clicked");
    this.friendManagementService.handleFriendshipStatus(null, friendShipRequest, friendId).subscribe(x => {
      this.searchUserName();
      this.waitingFriendshipRequestList(new FriendshipListViewModel(null, null, null));
    })    
  }

  public profileClick(userId: number) {
    console.log("userId = " + userId);
    this.app.getRootNav().push(ProfilePage, userId);
  }

  public receivedFriendshipRequestList(model: FriendshipListViewModel) {
    this.friendManagementService.receivedFriendshipRequestList(new FriendshipListViewModel(null, null, null))
      .subscribe((x: FriendManagementViewModel[]) => {
        this._friendshipList.next(x);
      }, error => {
        console.log("FriendshipList Refresher Error = " + JSON.stringify(error));
      });
  }

  public waitingFriendshipRequestList(model: FriendshipListViewModel) {
    this.friendManagementService
      .receivedFriendshipRequestList(new FriendshipListViewModel(null, null, null))
      .map((x: FriendManagementViewModel[]) => {
        console.log("waitingFriendshipRequestList map = " + JSON.stringify(x));
        this._friendshipList.next(null);
        return x.filter(y => y != null && y != undefined && y.isReceived && y.friendshipStatus == FriendshipStatus.Waiting);
      }).subscribe((x: FriendManagementViewModel[]) => {
        console.log("waitingFriendshipRequestList = " + JSON.stringify(x));                
        this._friendshipList.next(x);
        this.events.publish('toolbarUpdate');
      }, error => {
        console.log("FriendshipList Refresher Error = " + JSON.stringify(error));
      });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.waitingFriendshipRequestList(new FriendshipListViewModel(null, null, null));
    }, 500);
    refresher.complete();
  }
}
