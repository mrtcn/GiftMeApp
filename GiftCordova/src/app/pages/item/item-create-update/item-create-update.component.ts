import { Facebook, NativeStorage } from 'ionic-native';
import { NavParams } from 'ionic-angular';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, App, ViewController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { File, DirectoryEntry, FileEntry } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { AuthComponent } from '../../../auth/auth.component';
import { ItemDetailComponent } from './../item-detail/item-detail.component';
import { AccountService } from '../../../auth/shared/account.service';
import { ItemService } from '../../../services/item/item.service';
import { CreateUpdateItemModel, ItemIdModel, ItemViewModel, GiftItemCreateUpdateNavParams } from '../../../services/item/item.model';
import { StoredUserModel } from './../../../auth/shared/account.model';
import { GiftDatePickerComponent } from '../../helpers/directives/datepicker/datepicker.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var cordova: any;

@Component({
    selector: 'item-create-update',
    styleUrls: ['/item-create-update.scss'],
    templateUrl: 'item-create-update.html'
})
export class CreateUpdateItemComponent implements OnInit {
    lastImage: string = null;
    loading: Loading;

    createUpdateItem: CreateUpdateItemModel = new CreateUpdateItemModel(null, null, null, null, null);

    constructor(
        public accountService: AccountService,
        public itemService: ItemService,
        public navParams: NavParams,
        private camera: Camera,
        private transfer: Transfer,
        private file: File,
        private filePath: FilePath,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        public platform: Platform,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        private app: App) {
        var itemIdModel = navParams.data;
        if (itemIdModel.giftItemId) {
            itemService.getItemById(itemIdModel.giftItemId).subscribe((item: ItemViewModel) => {
                this.createUpdateItem.id = item.id;
                this.createUpdateItem.itemImagePath = item.itemImagePath;
                this.createUpdateItem.itemName = item.itemName;                
            });
        }
        
        this.accountService.getUserInfo().subscribe((user: StoredUserModel) => {
            itemIdModel.giftItemId
            this.createUpdateItem.userId = user.id;
            this.createUpdateItem.eventId = itemIdModel.eventId;
        }, error => {
            this.navCtrl.push(AuthComponent);
        });
    }

    ngOnInit() {
    }

    submitItem() {
        this.loading = this.loadingCtrl.create({
            content: 'Submitting...'
        });

        let createUpdateItemApiModel: CreateUpdateItemModel = new CreateUpdateItemModel(
            this.createUpdateItem.id,
            this.createUpdateItem.eventId,
            this.createUpdateItem.itemName,
            this.createUpdateItem.itemImagePath,
            this.createUpdateItem.userId
            );

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        this.itemService.createUpdateItem(createUpdateItemApiModel, targetPath, this.lastImage).subscribe(x => {
            this.loading.dismissAll();
            this.presentToast('Succesfully Created');

            var itemIdModel = new ItemIdModel(x);

            this.navCtrl.push(ItemDetailComponent, JSON.stringify(itemIdModel));

        }, error => console.log("error = " + JSON.stringify(error)));
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
            content: 'Uploading...'
        });
        this.loading.present();

        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
            this.loading.dismissAll();
            this.presentToast('Image succesful uploaded.');
        }, err => {
            this.loading.dismissAll();
            this.presentToast('Error while uploading file.');
        });
    }
}
