import { Component } from '@angular/core';
import { NavParams, Events } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';
import { UserInfo, UserIdModel } from './../../../auth/shared/account.model'
import { AccountService } from './../../../auth/shared/account.service'

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'profile-info-tab',
    styleUrls: ['/profile-info-tab.scss'],
    templateUrl: 'profile-info-tab.html'
})
export class ProfileInfoTab {

  private _profileInfo = new BehaviorSubject<UserInfo>(null);
  profileInfo = this._profileInfo.asObservable();

  constructor(
    public navParams: NavParams,
    public accountService: AccountService,
    public events: Events) {
    events.subscribe('tab:clicked', (profileTypeId, userId) => {
      this.accountService.getUserById(new UserIdModel(userId)).subscribe(x => {
        this._profileInfo.next(x);
      });
    });

    let profileTypeId: ProfileInfoTabNavParams = JSON.parse(JSON.stringify(this.navParams.data));

    this.accountService.getUserById(new UserIdModel(profileTypeId.userId)).subscribe(user => {
      console.log("profile-info-tab user = " + JSON.stringify(user));
      this._profileInfo.next(user);
    })
  }

  doRefresh(refresher) {

    setTimeout(() => {
      let profileTypeId: ProfileInfoTabNavParams = JSON.parse(JSON.stringify(this.navParams.data));
      this.accountService.getUserById(new UserIdModel(profileTypeId.userId)).subscribe(x => {
        refresher.complete();
        this._profileInfo.next(x);
      }, error => {
        console.log("Profile Info Tab Refresher Error = " + JSON.stringify(error));
      });
    }, 500);
  }
}

export class ProfileInfoTabNavParams {
  constructor(
    public userId: number,
    public profileTypeId: number
  ){}
}
