import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, Loading, LoadingController, App } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ImageHandler } from './../../helpers/image.helper';
import { AccountService } from '../../auth/shared/account.service';
import { UserInfo } from '../../auth/shared/account.model';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var cordova: any;

@Component({
    selector: 'profile-edit',
    templateUrl: 'profile-edit.html',
    styleUrls: ['/profile-edit.scss'],
    providers: [AccountService]
})

export class RegisterComponent implements OnInit {
    private _imgPath = new BehaviorSubject<string>(null);
    public imgPath = this._imgPath.asObservable();

    lastImage: string = null;
    loading: Loading;

    private _profileEditResult = new BehaviorSubject<UserInfo>(null);
    public profileEditResult = this._profileEditResult.asObservable();


    public profileEditModel: UserInfo = new UserInfo(null, null, null, null, null, null, null, null, null, null, null, null, null, null );

    constructor(
        public navCtrl: NavController,
        private imageHandler: ImageHandler,
        public loadingCtrl: LoadingController,
        public accountService: AccountService,
        private app: App) {


    }

    ngOnInit() {                
    }

    public redirectToAuth() {
        this.navCtrl.pop();
    }

    public register() {
        this.loading = this.loadingCtrl.create({
            content: 'Updating...',
        });


    }

    public presentActionSheet() {
        this.lastImage = this.imageHandler.presentActionSheet(this._imgPath);
    }

    public pathForImage(img): string {
        return this.imageHandler.pathForImage(img);
    }
}

