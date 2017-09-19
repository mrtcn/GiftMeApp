import { ActionSheetController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { File } from '@ionic-native/file';
import { Crop } from '@ionic-native/crop';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { ImageHandler } from './image.helper';
import { TranslateService } from '@ngx-translate/core';

declare var cordova: any;


export function imageHandlerFactory(
    camera: Camera,
    platform: Platform,
    filePath: FilePath,
    file: File,
    crop: Crop,
    toastCtrl: ToastController,
    fileTransfer: FileTransfer,
    loadingCtrl: LoadingController,
    actionSheetController: ActionSheetController,
    dialogs: Dialogs,
    translate: TranslateService) {
    return new ImageHandler(camera, platform, filePath, file, crop, toastCtrl, fileTransfer, loadingCtrl, actionSheetController, dialogs, translate);
}