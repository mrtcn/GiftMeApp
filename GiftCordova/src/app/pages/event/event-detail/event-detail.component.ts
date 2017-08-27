import { Facebook, NativeStorage } from 'ionic-native';
import { NavParams, Events } from 'ionic-angular';
import { NavController, LoadingController, Loading, App, ViewController, Tabs } from 'ionic-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthComponent } from '../../../auth/auth.component';
import { AccountService } from '../../../auth/shared/account.service';
import { StoredUserModel } from '../../../auth/shared/account.model';
import { CreateUpdateItemComponent } from '../../item/item-create-update/item-create-update.component';
import { CreateEventComponent } from '../../event/create-event/create-event.component';
import { EventDetailItemsComponent } from '../../event/event-detail/tab-contents/event-detail-items.component';
import { EventService } from '../../../services/event/event.service';
import { EventViewModel } from '../../../services/event/event.model';
import { GiftItemCreateUpdateNavParams } from '../../../services/item/item.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var cordova: any;

@Component({
    selector: 'event-detail',
    styleUrls: ['/event-detail.scss'],
    templateUrl: 'event-detail.html'
})
export class EventDetailComponent implements OnInit {
    private _eventDetail = new BehaviorSubject<EventViewModel>(null);
    eventDetail = this._eventDetail.asObservable();

    lastImage: string = null;
    loading: Loading;

    EventDetailItems1: any = EventDetailItemsComponent;
    EventDetailItems2: any = EventDetailItemsComponent;
    EventDetailItems3: any = EventDetailItemsComponent;
    
    private _isFavorite = new BehaviorSubject<boolean>(false);
    isFavorite = this._isFavorite.asObservable();

    @ViewChild('eventTabs') eventTabs: Tabs;

    constructor(
        public accountService: AccountService,
        public eventService: EventService,
        public navParams: NavParams,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public events: Events,
        private app: App)
    { }

    ngOnInit() {
        let eventId = JSON.parse(this.navParams.data);

        this.eventService.getEventById(eventId).subscribe(x => {
            this._eventDetail.next(x);
            console.log("isFavoriteEvent = " + JSON.stringify(x.isFavoriteEvent));
            this._isFavorite.next(x.isFavoriteEvent);
        });        
    }

    public eventTabsChanged(itemTypeId) {
        let event = this._eventDetail.getValue();
        this.events.publish('tab:clicked', itemTypeId, event.id);
    }

    public createItem() {
        let event = this._eventDetail.getValue();
        var giftItemCreateUpdateNavParams = new GiftItemCreateUpdateNavParams(event.id, null);
        this.navCtrl.push(CreateUpdateItemComponent, giftItemCreateUpdateNavParams);
    }

    public addEvent() {
        this.navCtrl.push(CreateEventComponent);
    }

    public addToFavorites(id) {
        console.log("eventId = " + id);
        this.eventService.addEventToFavorites(id, this._isFavorite.getValue()).subscribe(x => {
            console.log("addToFavorite Result = " + x);
            this._isFavorite.next(x);
        });
    }
}
