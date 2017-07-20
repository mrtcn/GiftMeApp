import { Facebook, NativeStorage } from 'ionic-native';
import { NavParams } from 'ionic-angular';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, App, ViewController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { File, DirectoryEntry, FileEntry } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { ImageHandler } from './../../../helpers/image.helper';
import { AuthComponent } from '../../auth/auth.component';
import { EventDetailComponent } from './../event-detail/event-detail.component';
import { AccountService } from '../../../auth/shared/account.service';
import { EventService } from '../../../services/event/event.service';
import { CreateEventModel, EventIdModel } from '../../../services/event/event.model';

import { GiftDatePickerComponent } from '../../helpers/directives/datepicker/datepicker.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var cordova: any;

@Component({
    selector: 'create-event',
    styleUrls: ['/create-event.scss'],
    templateUrl: 'create-event.html'
})
export class CreateEventComponent implements OnInit {
    private _imgPath = new BehaviorSubject<string>(null);
    public imgPath = this._imgPath.asObservable();

    lastImage: string = null;
    loading: Loading;

    createEvent: CreateEventModel = new CreateEventModel(null, null, null, null);

    constructor(
        public accountService: AccountService,
        public eventService: EventService,
        public navParams: NavParams,
        private camera: Camera,
        private transfer: Transfer,
        private file: File,
        private filePath: FilePath,
        private imageHandler: ImageHandler,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        public platform: Platform,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        private app: App)
    { }

    ngOnInit() {
    }

    submitEvent() {
        this.loading = this.loadingCtrl.create({
            content: 'Submitting...',
        });

        let createEventApiModel: CreateEventModel = new CreateEventModel(
            this.createEvent.eventDate,
            this.createEvent.eventName,
            this.createEvent.eventImagePath,
            this.createEvent.permission
            );

        console.log("createEventApiModel = " + JSON.stringify(createEventApiModel));

        // File for Upload
        var targetPath = this.imageHandler.pathForImage(this._imgPath.valueOf().toString());

        this.eventService.createEvent(createEventApiModel, targetPath, this._imgPath.valueOf().toString()).subscribe(x => {
            console.log("eventModel = " + JSON.stringify(x));

            this.loading.dismissAll();

            this.navCtrl.push(EventDetailComponent, x);

        }, error => {
            this.loading.dismissAll();
            console.log("submitEvent Exception = " + JSON.stringify(error));
        });
    }

    public presentActionSheet() {
        this.lastImage = this.imageHandler.presentActionSheet(this._imgPath);
    }

    public pathForImage(img): string {
        return this.imageHandler.pathForImage(img);
    }
}