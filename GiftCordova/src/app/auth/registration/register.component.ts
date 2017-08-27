import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, App, ViewController } from 'ionic-angular';
import { Facebook } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { File, DirectoryEntry, FileEntry } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { ImageHandler } from './../../helpers/image.helper';
import { AccountService } from '../shared/account.service';
import { RegisterViewModel, RegisterApiModel, LoginViewModel, AccessTokenModel } from '../shared/account.model';
import { HomeComponent } from '../../pages/home/home.component';
import { AuthComponent } from '../../auth/auth.component';

import { LocalizationService } from '../../services/localization/localization.service';
import { TranslateService } from '@ngx-translate/core';

import { Config } from '../providers/config/config';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var cordova: any;

@Component({
    selector: 'register',
    templateUrl: 'register.html',
    styleUrls: ['/register.scss'],
    providers: [AccountService]
})

export class RegisterComponent implements OnInit {
    private _imgPath = new BehaviorSubject<string>(null);
    public imgPath = this._imgPath.asObservable();

    lastImage: string = null;
    loading: Loading;

    private _registerResult = new BehaviorSubject<boolean>(false);
    public registerResult = this._registerResult.asObservable();

    private _loginResult = new BehaviorSubject<boolean>(false);
    public loginResult = this._loginResult.asObservable();

    public registration: RegisterViewModel = new RegisterViewModel(null, null, null, null, null, null );

    constructor(
        public navCtrl: NavController,
        private camera: Camera,
        private file: File,
        private imageHandler: ImageHandler,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        public platform: Platform,
        public loadingCtrl: LoadingController,
        public accountService: AccountService,
        private app: App,
        public viewCtrl: ViewController) {

        let birthdate = new Date();
        birthdate.setFullYear(birthdate.getFullYear() - 10);
        this.registration.birthdate = birthdate.toISOString();
    }

    ngOnInit() {                
    }

    public redirectToAuth() {
        this.navCtrl.pop();
    }

    public register() {
        this.loading = this.loadingCtrl.create({
            content: 'Registring...',
        });

        let registrationApiModel: RegisterApiModel = new RegisterApiModel(  this.registration.email,
                                                                            this.registration.userName,
                                                                            this.registration.gender,
                                                                            this.registration.password,                                                                            
                                                                            this.registration.confirmPassword,
                                                                            this.registration.birthdate);

        console.log("_imgPath = " + this._imgPath);
        console.log("imgPath = " + this._imgPath.valueOf().toString());
        // File for Upload
        let imgPath = !this._imgPath ? null : this._imgPath.valueOf().toString();
        console.log("2imgPath = " + imgPath);
        var targetPath = this.imageHandler.pathForImage(imgPath);
        var _targetPath = this.imageHandler.pathForImage(this._imgPath.valueOf().toString());

        console.log("targetPath = " + targetPath);
        console.log("_targetPath = " + _targetPath);

        this.accountService.register(registrationApiModel, targetPath, imgPath).subscribe(x => {

                this.loading.dismissAll()
                this.app.getRootNav().setRoot(HomeComponent);
            
        }, error => console.log("error = " + JSON.stringify(error)));
    }


    public presentActionSheet() {
        this.lastImage = this.imageHandler.presentActionSheet(this._imgPath);
    }

    public pathForImage(img): string {
        return this.imageHandler.pathForImage(img);
    }
}

