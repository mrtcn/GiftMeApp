import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, Tabs } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';
import { UserInfo, UserIdModel } from './../../auth/shared/account.model'
import { AccountService } from './../../auth/shared/account.service'
import { ProfileInfoTab } from './tabs/profile-info-tab.component';
import { EventTabComponent } from './../home/tabs/event-tab.component';
import { FriendTabComponent } from './../profile/tabs/friend-tab.component';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'profile',
    styleUrls: ['/profile.scss'],
    templateUrl: 'profile.html'
})
export class ProfilePage {

  private _profile = new BehaviorSubject<UserInfo>(null);
  profile = this._profile.asObservable();

  ProfileInfoTab: any = ProfileInfoTab;
  EventTab: any = EventTabComponent;
  FriendTab: any = FriendTabComponent;

  @ViewChild('profileTabs') profileTabs: Tabs;

  isNotificationIconHidden: boolean = false;
  isAddFriendIconHidden: boolean = false;
  isSearchIconHidden: boolean = true;
  isAddIconHidden: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public accountService: AccountService,
    public events: Events
  ) {
    let userId: number = this.navParams.data;
    console.log("this.navParams.data = " + this.navParams.data);
    console.log("userId 2 = " + userId);
    this.accountService.getUserById(new UserIdModel(userId)).subscribe(x => {
      this._profile.next(x);
    }, error => {
      console.log("Profile Info Tab Refresher Error = " + JSON.stringify(error));
    });
  }

  public profileTabsChanged(profileTypeId) {
    let profile = this._profile.getValue();
    console.log("profileTabsChanged = " + profile);
    this.events.publish('tab:clicked', profileTypeId, profile.id);
  }

  public navToProfileSettings() {
    console.log("navToProfileSettings is clicked");
  }
}
