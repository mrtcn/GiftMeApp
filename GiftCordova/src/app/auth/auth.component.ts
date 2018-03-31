import { Component, OnInit, Injectable, Inject, ViewEncapsulation  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StatusBar, Splashscreen, InAppBrowser, Facebook, NativeStorage } from 'ionic-native';

import { NavController, Platform, AlertController, App } from 'ionic-angular';
import { IName, RegisterExternalBindingModel, StoredUserModel, AccessTokenModel, LoginViewModel } from '../auth/shared/account.model';
import { AccountService } from './shared/account.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './registration/register.component';
import { HomeComponent } from '../pages/home/home.component';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { DialogModalService } from './../shared/modals/dialog/modal.dialog.service';
import { DeviceInfoModel } from './../services/device-info/device.info.model';
import { DeviceInfoService } from './../services/device-info/device.info.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'auth-page',
    styleUrls: ['/auth.scss'],
    templateUrl: 'auth.html',
    providers: [AccountService],
    encapsulation: ViewEncapsulation.None
})

export class AuthComponent implements OnInit {

    private _checkResult = new BehaviorSubject<boolean>(false);
    public checkResult = this._checkResult.asObservable();

    private accessToken: AccessTokenModel;
    private externalAccessToken: string;

    public login: LoginViewModel = new LoginViewModel(null, null);

    private _result = new BehaviorSubject<boolean>(false);
    result = this._result.asObservable();

    constructor(
      public navCtrl: NavController,
      private platform: Platform,
      public alertController: AlertController,
      public accountService: AccountService,
      private app: App,
      private push: Push,
      private dialog: DialogModalService,
      private deviceInfoService: DeviceInfoService) {

    }

    public clearCache() {
        this.accountService.removeAccountCaches();
    }

    ngOnInit() {  
        this.platform.ready().then(() => {
            this.accountService.isAuthenticated().subscribe((x: boolean) => {
                console.log("isAuthenticated");
                if (x === true) {
                    console.log("isAuthenticated true");
                    this.navCtrl.setRoot(HomeComponent);
                }
            }, error => { console.log("error = " + JSON.stringify(error)); });
        });
    }

    public loginSubmit() {
        let loginModel = new LoginViewModel(this.login.userName, this.login.password);
        this.accountService.login(loginModel).subscribe(x => {
            let result: boolean = x.valueOf();
            this._result.next(result);
            this.app.getRootNav().setRoot(HomeComponent);

            //// to check if we have permission
            //this.push.hasPermission()
            //  .then((res: any) => {

            //    if (res.isEnabled) {
            //      console.log('We have permission to send push notifications');
            //    } else {
            //      console.log('We do not have permission to send push notifications');
            //    }

            //  });
            
            //// to initialize push notifications

            //const options: PushOptions = {
            //  android: {
            //    /**
            //   * Maps to the project number in the Google Developer Console.
            //   */
            //    senderID: '601499812904'
            //  },
            //  ios: {
            //    alert: 'true',
            //    badge: true,
            //    sound: 'false'
            //  },
            //  windows: {},
            //  browser: {
            //    pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            //  }
            //};

            //const pushObject: PushObject = this.push.init(options);
          
            //pushObject.on('notification').subscribe((notification: any) => {

            //  this.dialog.displayDialogModal("Notification = " + JSON.stringify(notification), "Notification", "OK", null, null).subscribe(x => {
            //    console.log('Received a notification', JSON.stringify(notification));
            //  });

            //});

            //pushObject.on('registration').subscribe((registration: any) => {
            //  //this.deviceInfoService.RegisterDevice(registration.registrationId, null, null).subscribe(x => {
            //  //  console.log("Has Device Registered = " + x);
            //  //})              
            //});

            //pushObject.on('error').subscribe(error => {
            //  this.dialog.displayDialogModal("pushObject error = " + JSON.stringify(error), "ERROR", "OK", null, null).subscribe(x => {
            //    console.log('Received a error', + JSON.stringify(error));
            //  });
            //});

        }, err => {
            console.log("err = " + JSON.stringify(err));
        });
    }

    public redirectToRegister() {
        this.navCtrl.push(RegisterComponent, { isAuthenticated: false });
    }

    public navigate(tabIndex: Number) {
        if (tabIndex === 1) {
            this.navCtrl.push(LoginComponent, { isAuthenticated: false });
            return;
        } else if (tabIndex === 2) {
            this.navCtrl.push(RegisterComponent, { isAuthenticated: false });
            return;
        }

        //this.navCtrl.push(AuthenticationTabComponent, { tabIndex: tabIndex });
    }

    redirectToFacebook() {
        let alertCtrl = this.alertController;
        let permissions = new Array();
        let nav = this.navCtrl;
        //the permissions your facebook app needs from the user
        permissions = ["public_profile"];

        let accService = this.accountService;
        
        Facebook.login(permissions)
            .then(response => {
                let userId = response.authResponse.userID;
                let params = new Array();
                //Getting name and gender properties
                Facebook.api("/me?fields=name,gender,email", params)
                    .then(user => {
                        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                        let name: IName = accService.splitFullNameIntoParts(user.name);

                        this.externalAccessToken = response.authResponse.accessToken;
                        // Gets Access Token And Add External Token Into NativeStorage, Add Access Token Into NativeStorage If Method is Successful
                        accService.getAccessTokenForExternalUser(userId, "Facebook", this.externalAccessToken).subscribe((acc: AccessTokenModel) => {
                                let storedUserModel: StoredUserModel = new StoredUserModel(
                                    user.id,
                                    user.name,
                                    user.email,
                                    user.picture,
                                    user.gender,
                                    user.birthdate,
                                    response.authResponse.session_key,
                                    response.authResponse.secret
                                );
                                // Add User Into NativeStorage
                                accService.addUserIntoStorage(storedUserModel);
                                this.app.getRootNav().setRoot(HomeComponent);
                        }, error => {
                            let registerExternalBindingModel: RegisterExternalBindingModel = new
                                RegisterExternalBindingModel(user.name,
                                user.email,
                                user.picture,
                                this.externalAccessToken,
                                "Facebook",
                                userId
                            );
                            
                            accService.registerExternal(registerExternalBindingModel).subscribe((x: StoredUserModel) => {
                                // Add User Into NativeStorage
                                accService.addUserIntoStorage(x);
                                this.app.getRootNav().setRoot(HomeComponent);
                            });
                        });
                }, error => {
                    console.log(error);
                });            
            });
    }

    navToForgotPassword() {
      this.navCtrl.push(ForgotPasswordComponent);
    }
}
