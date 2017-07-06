import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, App, ViewController } from 'ionic-angular';
import { Facebook } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { File, DirectoryEntry, FileEntry } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { AccountService } from '../shared/account.service';
import { RegisterViewModel, RegisterApiModel, LoginViewModel, AccessTokenModel } from '../shared/account.model';
import { HomeComponent } from '../../pages/home/home.component';

import { LocalizationService } from '../../services/localization/localization.service';
import { TranslateService } from '@ngx-translate/core';

import { Config } from '../providers/config/config';

import {
    SearchApiModel, MovieConnection,
    GameInitialize, UserSelections
} from '../../app/movie-connection/connection.model';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var cordova: any;

@Component({
    selector: 'register',
    templateUrl: 'register.html',
    styleUrls: ['/register.scss'],
    providers: [AccountService]
})

export class RegisterComponent implements OnInit {

    lastImage: string = null;
    loading: Loading;

    private _registerResult = new BehaviorSubject<boolean>(false);
    public registerResult = this._registerResult.asObservable();

    private _loginResult = new BehaviorSubject<boolean>(false);
    public loginResult = this._loginResult.asObservable();

    public registration: RegisterViewModel = new RegisterViewModel(null, null, null, null, null, null, null );

    constructor(
        public navCtrl: NavController,
        private camera: Camera,
        private transfer: Transfer,
        private file: File,
        private filePath: FilePath,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        public platform: Platform,
        public loadingCtrl: LoadingController,
        public accountService: AccountService,
        private app: App,
        public viewCtrl: ViewController) {
    }

    ngOnInit() {                
    }

    public register() {
        this.loading = this.loadingCtrl.create({
            content: 'Registring...',
        });

        let fullNameArray: string[] = this.registration.fullName.split(" ");
        let firstName: string = fullNameArray.slice(0, -1).join(" ");
        let lastName: string = fullNameArray.slice(fullNameArray.length - 1).join("");
        let registrationApiModel: RegisterApiModel = new RegisterApiModel(  this.registration.fullName,
                                                                            firstName,
                                                                            lastName,
                                                                            this.registration.email,
                                                                            this.registration.userName,
                                                                            this.registration.isFemale?2:1,
                                                                            this.registration.password,
                                                                            this.registration.confirmPassword);

        console.log("registrationApiModel = " + JSON.stringify(registrationApiModel));

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        this.accountService.register(registrationApiModel, targetPath, this.lastImage).subscribe(x => {

                this.loading.dismissAll()
                this.presentToast('Succesfully Registered.');

                this.app.getRootNav().setRoot(HomeComponent);
            
        }, error => console.log("error = " + JSON.stringify(error)));
    }

    public close() {
        console.log("close before nav")
        this.navCtrl.pop();
        console.log("close after nav")
    }

    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }
    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        // Get the data of an image
        this.camera.getPicture(options).then((imagePath) => {
            // Special handling for Android library
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));

                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

                    });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
        }, (err) => {
            this.presentToast('Error while selecting image.');
        });
    }

    // Create a new name for the image
    private createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
        return newFileName;
    }

    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            console.log("namePath = " + namePath);
            console.log("currentName = " + currentName);
            console.log("cordova.file.dataDirectory = " + cordova.file.dataDirectory);
            console.log("newFileName = " + newFileName);
            this.lastImage = newFileName;
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + img;
        }
    }

    public uploadImage() {
        // Destination URL
        var url = "http://yoururl/upload.php";

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;

        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename }
        };

        const fileTransfer: TransferObject = this.transfer.create();

        this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
        });
        this.loading.present();

        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
            this.loading.dismissAll()
            this.presentToast('Image succesful uploaded.');
        }, err => {
            this.loading.dismissAll()
            this.presentToast('Error while uploading file.');
        });
    }
}

