import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, App, Events } from 'ionic-angular';
import { FriendManagementService } from '../../../services/friend-management/friend.management.service';
import { UserIdModel, FriendManagementViewModel, FriendshipStatus } from '../../../services/friend-management/friend.management.model';
import { ProfilePage } from '../../../pages/profile/profile.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'friend-tab',
    styleUrls: ['/friend-tab.scss'],
    templateUrl: 'friend-tab.html'
})
export class FriendTabComponent {
  private _friendList = new BehaviorSubject<Array<FriendManagementViewModel>>(null);
    public friendList = this._friendList.asObservable();

    constructor(
        private friendManagementService: FriendManagementService,
        private navParams: NavParams,
        private navCtrl: NavController,
        private events: Events,
        private app: App) {

      //Profile sayfasından arkadaşlar tabına basınca, useridmodel boş gidiyor dolayısı ile auth kullanıcının arkadaşları dönüyor

      events.subscribe('tab:clicked', (profileTypeId, userId) => {
        console.log("friend tab:clicked userId = " + userId);
        friendManagementService.friendshipList(new UserIdModel(userId)).subscribe((x: FriendManagementViewModel[]) => {
          this._friendList.next(x);
        });
      });

      let user = this.navParams.data;
      console.log("friend tab:clicked this.navParams.data; = " + user.userId);
      this.friendManagementService.friendshipList(new UserIdModel(user.userId)).subscribe((x: FriendManagementViewModel[]) => {
        this._friendList.next(x);
      })
    }
  
    handleFriendshipStatus(friendShipRequest: number, friendId: number) {
      console.log("Friendship Request Clicked");
      this.friendManagementService.handleFriendshipStatus(null, friendShipRequest, friendId).subscribe(x => {
        this._friendList.next(x);
      });
    }

    onLink(url: string) {
        window.open(url);
    }

    public profileClick(userId: number) {
      console.log("userId = " + userId);
      this.app.getRootNav().push(ProfilePage, userId);
    }

    doRefresh(refresher) {
      setTimeout(() => {
        refresher.complete();
        let user = this.navParams.data;
        this.friendManagementService.friendshipList(new UserIdModel(user.userId)).subscribe((x: FriendManagementViewModel[]) => {
          this._friendList.next(x);
        })
      },500)
    }
}
