import { ActionSheetController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { ImageHandler } from './image.helper';

declare var cordova: any;


export function imageHandlerFactory(
    camera: Camera,
    platform: Platform,
    filePath: FilePath,
    file: File,
    toastCtrl: ToastController,
    fileTransfer: FileTransfer,
    loadingCtrl: LoadingController,
    actionSheetController: ActionSheetController) {
    return new ImageHandler(camera, platform, filePath, file, toastCtrl, fileTransfer, loadingCtrl, actionSheetController);
}