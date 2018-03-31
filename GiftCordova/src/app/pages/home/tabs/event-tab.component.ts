import { Facebook, NativeStorage } from 'ionic-native';
import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, App, Events } from 'ionic-angular';
import { AccountService } from '../../../auth/shared/account.service';
import { EventService } from '../../../services/event/event.service';
import { HomeEventListViewModel, EventIdModel, EventListModel, EventDetailModel } from '../../../services/event/event.model';
import { EventDetailComponent } from '../../../pages/event/event-detail/event-detail.component';
import { ProfilePage } from './../../profile/profile.component'

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

        console.log("JSON.stringify(this.navParams.data) = " + this.navParams.data);
        console.log("JSON.stringify(this.navParams.data) JSON.stringify = " + JSON.stringify(this.navParams.data));

        let paramModel: EventListModel = JSON.parse(JSON.stringify(this.navParams.data));
        paramModel.searchTerm = searchTerm;
        console.log("searchbarInput searchTerm = " + searchTerm );

        console.log("JSON.Parse = " + JSON.stringify(paramModel));
        
        this.eventService.searchEventList(paramModel).subscribe((x: Array<HomeEventListViewModel>) => {
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
        let paramModel: EventListModel = JSON.parse(JSON.stringify(this.navParams.data));
        return this.eventService.getEventList(paramModel).subscribe((x: HomeEventListViewModel[]) => {
            this._eventList.next(x);
        }, error => {
        });
    }

    public eventClick(eventId: number) {
      console.log("eventID = " + eventId);
      this.app.getRootNav().push(EventDetailComponent, new EventDetailModel(2, eventId));
    }

    public navToProfile(userId: number) {
      console.log("userId = " + userId);
      this.app.getRootNav().push(ProfilePage, userId);
    }

    doRefresh(refresher) {
      setTimeout(() => {
        let paramModel: EventListModel = JSON.parse(JSON.stringify(this.navParams.data));
        this.eventService.getEventList(paramModel).subscribe((x: HomeEventListViewModel[]) => {
                this._eventList.next(x);
                refresher.complete();
            }, error => {
                console.log("Event Tab Refresher Error = " + JSON.stringify(error));
            });
        }, 500);
    }
}
