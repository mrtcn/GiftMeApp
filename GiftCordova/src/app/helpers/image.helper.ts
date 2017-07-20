import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, App, ViewController } from 'ionic-angular';
import { File, DirectoryEntry, FileEntry } from '@ionic-native/file';
import { Transfer, TransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Camera } from '@ionic-native/camera';

import { HttpResponseSuccessModel, HttpResponseErrorModel } from './../interceptors/http.model'

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';

declare var cordova: any;


export class ImageHandler {
    public lastImage: string;
    public loading: Loading;

    public constructor(
        public camera: Camera,
        public platform: Platform,
        public filePath: FilePath,
        public file: File,
        public toastCtrl: ToastController,
        public transfer: Transfer,
        public loadingCtrl: LoadingController,
        public actionSheetCtrl: ActionSheetController
    ) {
        
    }

    public presentActionSheet(imgPath: BehaviorSubject<string>): string {
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
    private copyFileToLocalDir(namePath, currentName, newFileName, imgPath: BehaviorSubject<string>) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
        this.lastImage = newFileName;
        imgPath.next(newFileName);
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

    public uploadImage(url, options: FileUploadOptions): Observable<any> {

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;

        //var options = {
        //    fileKey: "file",
        //    fileName: filename,
        //    chunkedMode: false,
        //    mimeType: "multipart/form-data",
        //    params: { 'fileName': filename }
        //};

        const fileTransfer: TransferObject = this.transfer.create();

        this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
        });
        this.loading.present();

        let fileUploadPromise: Promise<FileUploadResult> = fileTransfer.upload(targetPath, url, options);
        let fileUploadObservable: Observable<FileUploadResult> = Observable.fromPromise(fileUploadPromise);

        //// Use the FileTransfer to upload the image
        return fileUploadObservable.map((data: FileUploadResult) => {
            this.loading.dismissAll();
            this.presentToast('Image succesful uploaded.');
            console.log("httpResponseSuccess = " + data.response);
            var responseItem: HttpResponseSuccessModel = JSON.parse(data.response);
            console.log("httpResponseSuccess2 = " + JSON.stringify(responseItem));

            return responseItem.content;
        }, err => {
            this.loading.dismissAll();
            this.presentToast('Error while uploading file.');
            return null;
        });
    }
}