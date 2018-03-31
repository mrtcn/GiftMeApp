import { Facebook, NativeStorage } from 'ionic-native';
import { NavController, NavParams, LoadingController, Loading, App, ViewController, DateTime } from 'ionic-angular';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ImageHandler } from './../../../helpers/image.helper';
import { AuthComponent } from '../../auth/auth.component';
import { EventDetailComponent } from './../event-detail/event-detail.component';
import { AccountService } from '../../../auth/shared/account.service';
import { EventService } from '../../../services/event/event.service';
import { CreateEventModel, EventIdModel, EventDetailModel } from '../../../services/event/event.model';
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
export class CreateEventComponent implements OnInit, AfterViewInit {
    private _imgPath = new BehaviorSubject<string>(null);
    public imgPath = this._imgPath.asObservable();

    lastImage: string = null;
    loading: Loading;

    @ViewChild('datetime') datetime: DateTime;

    createEvent: CreateEventModel;

    constructor(
        public accountService: AccountService,
        public eventService: EventService,
        public navParams: NavParams,
        private imageHandler: ImageHandler,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        private app: App)
    {
        this.setInitValues();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        let today: Date = new Date();
        let averageWishlistDeadline: number = 30;

        this.datetime.min = today.toISOString();
        this.datetime.max = new Date(2049, 1, 1).toISOString();        
    }

    private setInitValues() {
        let today: Date = new Date();
        let averageWishlistDeadline: number = 30;
        today.setDate(today.getDate() + averageWishlistDeadline).toString();
        this.createEvent = new CreateEventModel(0, today.toISOString(), null, null, 0);
    }

    submitEvent() {
        this.loading = this.loadingCtrl.create({
            content: 'Submitting...',
        });

        // File for Upload
        let imgPath = !this._imgPath.getValue() ? null : this._imgPath.getValue().toString();
        var targetPath = this.imageHandler.pathForImage(imgPath);

        console.log("submitEvent imgPath = " + imgPath);
        console.log("submitEvent targetPath = " + targetPath);

        this.eventService.createEvent(this.createEvent, targetPath, imgPath).subscribe(x => {
            this.loading.dismissAll();
            this.navCtrl.pop().then(() => {
              this.navCtrl.popTo(EventDetailComponent, new EventDetailModel(2, x))
            })
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
