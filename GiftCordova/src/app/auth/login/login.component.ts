import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, Platform, App } from 'ionic-angular';
import { Facebook } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { AccountService } from '../shared/account.service';
import { LoginViewModel, StoredUserModel } from '../shared/account.model';
import { HomeComponent } from '../../pages/home/home.component';

import {
    SearchApiModel, MovieConnection,
    GameInitialize, UserSelections
} from '../../app/movie-connection/connection.model';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'login',
    templateUrl: 'login.html',
    styleUrls: ['/login.scss'],
    providers: [AccountService]
})

export class LoginComponent implements OnInit {

    public login: LoginViewModel = new LoginViewModel(null, null);

    private _result = new BehaviorSubject<boolean>(false);
    result = this._result.asObservable();

    constructor(public navCtrl: NavController, private platform: Platform, private accountService: AccountService, private app: App) {
    }

    ngOnInit() {
    }

    public loginSubmit() {
        let loginModel = new LoginViewModel(this.login.userName, this.login.password);
        this.accountService.login(loginModel).subscribe(x => {
            let result: boolean = x.valueOf();
            this._result.next(result);
            this.app.getRootNav().setRoot(HomeComponent);
        }, err => {
            console.log("err = " + JSON.stringify(err));
        });
    }

    public loginUser() {
        let loginModel = new LoginViewModel(this.login.userName, this.login.password);
        this.accountService.login(loginModel).subscribe(x => {
            let result: boolean = x.valueOf();
            this._result.next(result);
            this.app.getRootNav().setRoot(HomeComponent);
        }, err => {
            console.log("err = " + JSON.stringify(err));
        });

    }
}

