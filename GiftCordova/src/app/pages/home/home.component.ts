import { Facebook, NativeStorage, Keyboard } from 'ionic-native';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Events, Searchbar, NavController } from 'ionic-angular';
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
    templateUrl: 'home.html',
    providers: [Keyboard]
})
export class HomeComponent implements OnInit {
    private _userEventList = new BehaviorSubject<Array<HomeEventListViewModel>>(null);
    public userEventList = this._userEventList.asObservable();
    searchTerm: string = '';
    isSearchbarOn: boolean = true;

    EventTab: any = EventTabComponent;

    @ViewChild('searchbar') searchbar: Searchbar;

    constructor(
        private accountService: AccountService,
        private eventService: EventService,
        private navCtrl: NavController,
        private events: Events
        ) {
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
        this.events.publish('searchbarInput', this.searchTerm);
    }

    toggleSearchbar() {        
        console.log("toggleSearchbar");
        this.searchTerm = '';
        this.isSearchbarOn = !this.isSearchbarOn;        
        this.events.publish('searchbarInput', null);
        
        if (this.isSearchbarOn) {
            Keyboard.close();
        } else {
            setTimeout(() => {
                this.searchbar.setFocus();
            }, 250)
            
            Keyboard.show();
        }

        
    }
}
