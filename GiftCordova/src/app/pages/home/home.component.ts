import { Component, OnInit} from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import { EventTabComponent } from './tabs/event-tab.component';

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

    EventTab: any = EventTabComponent;    

    isNotificationIconHidden: boolean = false;
    isAddFriendIconHidden: boolean = false;
    isSearchIconHidden: boolean = false;
    isAddIconHidden: boolean = false;

    constructor(        
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
    
    searchAction(emp) {
      console.log("searchText = " + emp);
      this.events.publish('searchbarInput', emp);
    }

}
