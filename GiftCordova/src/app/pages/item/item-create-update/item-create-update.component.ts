import { Facebook, NativeStorage } from 'ionic-native';
import { NavParams } from 'ionic-angular';
import { NavController, LoadingController, Loading, App, ViewController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { ImageHandler } from './../../../helpers/image.helper';
import { AuthComponent } from '../../../auth/auth.component';
import { EventDetailComponent } from './../../event/event-detail/event-detail.component';
import { AccountService } from '../../../auth/shared/account.service';
import { ItemService } from '../../../services/item/item.service';
import { EventDetailModel } from '../../../services/event/event.model';
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
    private _imgPath = new BehaviorSubject<string>(null);
    public imgPath = this._imgPath.asObservable();

    lastImage: string = null;
    loading: Loading;

    createUpdateItem: CreateUpdateItemModel = new CreateUpdateItemModel(0, null, null, null, null, null, null, null, null);

    constructor(
        public accountService: AccountService,
        public itemService: ItemService,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        private imageHandler: ImageHandler,
        private app: App) {
        var itemIdModel = navParams.data;
        if (itemIdModel.giftItemId) {
            itemService.getItemById(itemIdModel.giftItemId).subscribe((item: ItemViewModel) => {
                this.createUpdateItem.id = item.id;
                this.createUpdateItem.giftItemImagePath = item.giftItemImagePath;
                this.createUpdateItem.giftItemName = item.giftItemName;                
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

        // File for Upload
        let imgPath = !this._imgPath.getValue() ? null : this._imgPath.getValue().toString();
        var targetPath = this.imageHandler.pathForImage(imgPath);

        this.itemService.createUpdateItem(this.createUpdateItem, targetPath, imgPath).subscribe(x => {
            this.loading.dismissAll();
            var itemIdModel = new ItemIdModel(x);

            this.navCtrl.pop().then(() => {
              this.navCtrl.popTo(EventDetailComponent, new EventDetailModel(2, x))
            })
        }, error => console.log("error = " + JSON.stringify(error)));
    }

    public presentActionSheet() {
        this.lastImage = this.imageHandler.presentActionSheet(this._imgPath);
    }

    public pathForImage(img): string {
        return this.imageHandler.pathForImage(img);
    }
}
