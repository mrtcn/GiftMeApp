import { Facebook, NativeStorage } from 'ionic-native';
import { NavParams } from 'ionic-angular';
import { NavController, LoadingController, Loading, App, ViewController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { AuthComponent } from '../../../auth/auth.component';
import { AccountService } from '../../../auth/shared/account.service';
import { ItemService } from '../../../services/item/item.service';
import { ItemViewModel } from '../../../services/item/item.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var cordova: any;

@Component({
    selector: 'item-detail',
    styleUrls: ['/item-detail.scss'],
    templateUrl: 'item-detail.html'
})
export class ItemDetailComponent implements OnInit {
    private _itemDetail = new BehaviorSubject<ItemViewModel>(null);
    itemDetail = this._itemDetail.asObservable();

    lastImage: string = null;
    loading: Loading;

    constructor(
        public accountService: AccountService,
        public itemService: ItemService,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        private app: App)
    {

    }

    ngOnInit() {
        let itemModel = JSON.parse(this.navParams.data);

        this.itemService.getItemById(itemModel.itemId).subscribe( x => {
            this._itemDetail.next(x);
        });
    }

    onLink(url: string) {
        window.open(url);
    }
}
