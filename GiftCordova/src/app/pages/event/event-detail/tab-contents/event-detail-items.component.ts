import { Facebook, NativeStorage } from 'ionic-native';
import { NavParams, Events } from 'ionic-angular';
import { NavController, LoadingController, Loading, App, ViewController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { CreateEventComponent } from '../../event/create-event/create-event.component';
import { ItemService } from '../../../../services/item/item.service';
import { EventService } from '../../../../services/event/event.service';
import { ItemViewModel, GiftItemTabNavParams } from '../../../../services/item/item.model';
import { GiftItemCreateUpdateNavParams } from '../../../services/item/item.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var cordova: any;

@Component({
    selector: 'event-detail-items',
    styleUrls: ['/event-detail-items.scss'],
    templateUrl: 'event-detail-items.html'
})
export class EventDetailItemsComponent implements OnInit  {
    private _itemDetail = new BehaviorSubject<ItemViewModel[]>(null);
    itemDetail = this._itemDetail.asObservable();

    itemToggle: number = 0;
    lastImage: string = null;
    loading: Loading;
    
    constructor(
        public itemService: ItemService,
        public eventService: EventService,
        public navParams: NavParams,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public events: Events,
        private app: App) {
        events.subscribe('tab:clicked', (itemTypeId, eventId) => {
            this.itemService.getItemList(eventId, itemTypeId).subscribe(x => {
                this._itemDetail.next(x);
            });
        });
    }

    ngOnInit() {
        console.log("navParams.data = " + JSON.stringify(this.navParams.data));
        let itemParams: GiftItemTabNavParams = JSON.parse(JSON.stringify(this.navParams.data));
        console.log("itemParams eventId = " + itemParams.eventId);
        console.log("itemParams itemTypeId = " + itemParams.itemTypeId);
        this.itemService.getItemList(itemParams.eventId, itemParams.itemTypeId).subscribe(x => {
            this._itemDetail.next(x);
        });
    }    

    public createItem() {
        let event = this._itemDetail.getValue();
        //var giftItemCreateUpdateNavParams = new GiftItemCreateUpdateNavParams(event.id, null);
        //this.navCtrl.push(CreateUpdateItemComponent, giftItemCreateUpdateNavParams);
    }

    public toggleItemDescription(id) {
        this.itemToggle = (this.itemToggle == id) ? 0 : id;
    }

    public toggleBuyStatus(id, isBought, giftStatus) {
        if (giftStatus == 2)
            return null;

        this.itemService.toggleItemBuyStatus(id, !isBought, giftStatus).subscribe(x => {            
            let itemParams: GiftItemTabNavParams = JSON.parse(JSON.stringify(this.navParams.data));
            this.itemService.getItemList(itemParams.eventId, itemParams.itemTypeId).subscribe(itemDetail => {
                this._itemDetail.next(itemDetail);
            });
        });
    }
}
