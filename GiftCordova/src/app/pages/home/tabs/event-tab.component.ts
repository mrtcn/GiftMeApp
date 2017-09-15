import { Facebook, NativeStorage } from 'ionic-native';
import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, App, Events } from 'ionic-angular';
import { AccountService } from '../../../auth/shared/account.service';
import { EventService } from '../../../services/event/event.service';
import { HomeEventListViewModel } from '../../../services/event/event.model';
import { EventDetailComponent } from '../../../pages/event/event-detail/event-detail.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'event-tab',
    styleUrls: ['/event-tab.scss'],
    templateUrl: 'event-tab.html'
})
export class EventTabComponent implements OnInit {
    private _eventList = new BehaviorSubject<Array<HomeEventListViewModel>>(null);
    public eventList = this._eventList.asObservable();

    constructor(
        private accountService: AccountService,
        private eventService: EventService,
        private navParams: NavParams,
        private navCtrl: NavController,
        private events: Events,
        private app: App) {
        this.events.subscribe('searchbarInput', (searchTerm) => {
            this.eventService.searchEventList(this.navParams.data, searchTerm).subscribe((x: Array<HomeEventListViewModel>) => {
                console.log("toggleSearchbar subscribe works");
                this._eventList.next(x);
            }, error => {
                console.log("toggleSearchbar subscribe errors");
            });
        })
    }

    ngOnInit()
    {
        this.getEventList();
    }

    onLink(url: string) {
        window.open(url);
    }

    public getEventList() {
        return this.eventService.getEventList(this.navParams.data).subscribe((x: Array<HomeEventListViewModel>) => {
            this._eventList.next(x);
        }, error => {
        });
    }

    public eventClick(eventId: number) {
        this.app.getRootNav().push(EventDetailComponent, eventId);
    }

}
