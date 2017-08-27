import { Facebook, NativeStorage } from 'ionic-native';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthComponent } from '../../auth/auth.component';
import { EventTabComponent } from './tabs/event-tab.component';
import { CreateEventComponent } from '../event/create-event/create-event.component';
import { AccountService } from '../../auth/shared/account.service';
import { EventService } from '../../services/event/event.service';
import { HomeEventListViewModel } from '../../services/event/event.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'home',
    styleUrls: ['/home.scss'],
    templateUrl: 'home.html'
})
export class HomeComponent implements OnInit {
    private _userEventList = new BehaviorSubject<Array<HomeEventListViewModel>>(null);
    public userEventList = this._userEventList.asObservable();
    searchTerm: string = '';
    isSearchbarOn: boolean = false;

    EventTab: any = EventTabComponent;

    constructor(public accountService: AccountService, public eventService: EventService, public navCtrl: NavController) {
    }

    ngOnInit()
    {
    }

    onLink(url: string) {
        window.open(url);
    }

    addEvent() {
        this.navCtrl.push(CreateEventComponent);
    }

    searchEvent() {
        console.log("searchText = " + this.searchTerm);
    }

    toggleSearchbar() {
        console.log("toggleSearchbar");
        this.searchTerm = '';
        this.isSearchbarOn = !this.isSearchbarOn;
    }
}
