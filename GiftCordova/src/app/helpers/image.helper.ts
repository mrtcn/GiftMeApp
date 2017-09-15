import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, App, ViewController } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Camera } from '@ionic-native/camera';
import { TranslateService } from '@ngx-translate/core';

import { HttpResponseSuccessModel, HttpResponseErrorModel } from './../interceptors/http.model'

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';

declare var cordova: any;


export class ImageHandler {
    public lastImage: string;
    public loading: Loading;

    public constructor(
        private camera: Camera,
        private platform: Platform,
        private filePath: FilePath,
        private file: File,
        private toastCtrl: ToastController,
        private fileTransfer: FileTransfer,
        private loadingCtrl: LoadingController,
        private actionSheetCtrl: ActionSheetController,
        private dialogs: Dialogs,
        private translate: TranslateService
    ) {        
    }

    public presentActionSheet(imgPath: BehaviorSubject<string>): string {
        console.log("presentActionSheet = " + imgPath.getValue());
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, imgPath);
                    }
                }, {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA, imgPath);
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
        return this.lastImage;
    }

    public takePicture(sourceType, imgPath: BehaviorSubject<string>) {
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
                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), imgPath);                        

                    });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

                this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), imgPath);
            }
            
        }, (err) => {
            this.translate.get('IMAGE_SELECTION_ERROR').map((errorTitle: string) => {
                this.presentToast(errorTitle);
            })
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
    private copyFileToLocalDir(namePath, currentName, newFileName, imgPath: BehaviorSubject<string>) {
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
        this.lastImage = newFileName;
        imgPath.next(newFileName);
        }, error => {
            console.log(" Error while storing file.");
            this.translate.get('UNSUCCESSFUL_IMAGE_UPLOAD_TITLE').map((favoriteTitle: string) => {
                this.presentToast(favoriteTitle);
            })
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
        if (!img) {
            return null;
        } else {            
            return this.file.dataDirectory + img
        }
    }

    public uploadImage(url, options: FileUploadOptions): Observable<any> {

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;

        try {
            const fileTransfer: FileTransferObject = this.fileTransfer.create();

            this.loading = this.loadingCtrl.create({
                content: 'Uploading...',
            });
            this.loading.present();
            let fileUploadPromise: Promise<FileUploadResult> = fileTransfer.upload(targetPath, url, options).then(x => x);
            let fileUploadObservable: Observable<FileUploadResult> = Observable.fromPromise(fileUploadPromise);
            //// Use the FileTransfer to upload the image
            return fileUploadObservable.map((data: FileUploadResult) => {
                let responseItem: HttpResponseSuccessModel = JSON.parse(data.response);
                this.loading.dismissAll();
                return responseItem.content;
            }, err => {
                return Observable.throw(1);

            }).catch(error => {                    
                return Observable.throw(2);
            });
        } catch (error) {            
            return Observable.throw(3);
        }        
    }

    public displayImageUploadError(errorType: number): Observable<any> {

        //this.displayImageUploadError(error, 'UNSUCCESSFUL_IMAGE_UPLOAD_TITLE', 'UNSUCCESSFUL_IMAGE_UPLOAD_MESSAGE').map(x => x)
        let uploadErrorTitle: string = errorType == 1 ? 'UNSUCCESSFUL_REGISTRATION_TITLE' : errorType == 2 ? 'UNSUCCESSFUL_IMAGE_UPLOAD_TITLE' : errorType == 3 ? 'UNSUCCESSFUL_IMAGE_UPLOAD_TITLE' : 'UNKNOWN_ERROR_TITLE'
        let uploadErrorMessage: string = errorType == 1 ? 'UNSUCCESSFUL_REGISTRATION_MESSAGE' : errorType == 2 ? 'UNSUCCESSFUL_IMAGE_UPLOAD_MESSAGE' : errorType == 3 ? 'UNSUCCESSFUL_IMAGE_UPLOAD_MESSAGE' : 'UNKNOWN_ERROR_MESSAGE'
        console.log("UploadImage Exception: ");
        this.loading.dismissAll();

        return this.translate.get(uploadErrorTitle).flatMap((favoriteTitle: string) => {
            return this.translate.get(uploadErrorMessage).flatMap((favoriteText: string) => {
                return this.dialogs.alert(favoriteText, favoriteTitle).then(x => {
                    console.log("Dialog Dismissed");
                    return null;
                }).catch(x => {
                    console.log("Dialog Exception");
                    return Observable.throw(null);
                });
            });
        });        
    }
}