import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen, InAppBrowser, Facebook, NativeStorage } from 'ionic-native';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { IName } from './auth/shared/account.model';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { AccountService } from './auth/shared/account.service';
import { LocalizationService } from './services/localization/localization.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    //FB_APP_ID: number = 122245798322606;

    private _response = new BehaviorSubject<Response>(null);
    response = this._response.asObservable();

    private _isAuthenticated = new BehaviorSubject<boolean>(false);
    isAuthenticated = this._isAuthenticated.asObservable();

    rootPage: any = AuthComponent;

    pages: Array<{ title: string, component: any }>;

    constructor(
        public platform: Platform,
        private http: Http,
        public alertController: AlertController,
        public accountService: AccountService,
        public localizationService: LocalizationService) {

        this.initializeApp();
        //Facebook.browserInit(this.FB_APP_ID, "v2.8");
        // used for an example of ngFor and navigation
        
        let env = this;
        //env.nav.push(Page2);

        //this.accountService.isAuthenticated().subscribe(x => {
        //    if (x) {
        //        this._isAuthenticated.next(x);
        //        this.nav.setRoot(HomeComponent);
        //        Splashscreen.hide();
        //    }
        //},
        //function(error) {
        //    Splashscreen.hide();
        //});
        this.localizationService.translateConfig();
    }

   
    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        //this.nav.setRoot(page.component);
    }
}
export class ResponseModel {
    provider: string;
    response_type: string;
    client_id: string;
    redirect_uri: string;
}
