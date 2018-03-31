import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { AccountService } from '../../auth/shared/account.service';
import { HttpResponseSuccessModel, HttpResponseErrorModel } from './../../interceptors/http.model';
import { InterceptedHttp } from '../../interceptors/http.interceptor';
import { FriendManagementViewModel, SearchTextModel, FriendshipListViewModel, FriendManagementModel, FriendshipStatusModel, FriendshipStatus, UserIdModel } from './friend.management.model';
import { TranslateService } from '@ngx-translate/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FriendManagementService {
  constructor(
    private accountService: AccountService,
    private translate: TranslateService,
    private http: InterceptedHttp    
  ) {

  }

  public receivedFriendshipRequestList(model: FriendshipListViewModel): Observable<FriendManagementViewModel[]> {
    return this.http.authorizedPost("api/Friend/ReceivedFriendshipRequestList", JSON.stringify(model), null).flatMap((res: Response) => {
      let response: HttpResponseSuccessModel = res.json();
      let friendshipList: FriendManagementModel[] = response.content;

      let friendManagementViewModelObservableList: Observable<FriendManagementViewModel>[] = [];

      for (let friendship of friendshipList) {
        friendManagementViewModelObservableList.push(this.generateButtonList(friendship).map(generateButton => {
          return new FriendManagementViewModel(friendship.userId, friendship.userName, friendship.friendshipStatus, generateButton, friendship.isReceived, friendship.thumbnailPath);
        }));
      }

      return Observable.forkJoin(friendManagementViewModelObservableList);
    })
  }

  public receivedFriendshipRequestCount(model: FriendshipListViewModel): Observable<number> {
    return this.http.authorizedPost("api/Friend/ReceivedFriendshipRequestCount", JSON.stringify(model), null).map((res: Response) => {
      let response: HttpResponseSuccessModel = res.json();
      let friendshipRequestCount: number = response.content;
      return friendshipRequestCount;
    })
  }

  public friendshipList(model?: UserIdModel): Observable<FriendManagementViewModel[]> {
    return this.http.authorizedPost("api/Friend/FriendshipList", JSON.stringify(model), null).flatMap((res: Response) => {
      let response: HttpResponseSuccessModel = res.json();
      let friendshipList: FriendManagementModel[] = response.content;

      let friendManagementViewModelObservableList: Observable<FriendManagementViewModel>[] = [];

      for (let friendship of friendshipList) {
        friendManagementViewModelObservableList.push(this.generateButtonList(friendship).map(generateButton => {
          return new FriendManagementViewModel(friendship.userId, friendship.userName, friendship.friendshipStatus, generateButton, friendship.isReceived, friendship.thumbnailPath);
        }));
      }

      return Observable.forkJoin(friendManagementViewModelObservableList);
    })
  }

  public searchUser(searchText: string): Observable<FriendManagementViewModel[]> {
    let body = new SearchTextModel(searchText);
    return this.http.authorizedPost("api/Friend/SearchUser", JSON.stringify(body), null).flatMap((res: Response) => {
      let response: HttpResponseSuccessModel = res.json();
      let searchList: FriendManagementModel[] = response.content;
      let searchListObservable: Observable<FriendManagementModel[]> = Observable.of(searchList);

      console.log("searchuser = " + JSON.stringify(response.content));

      let friendManagementViewModelList: FriendManagementViewModel[] = new Array() as Array<FriendManagementViewModel>;
      let index: number = 0;

      return searchListObservable
        .flatMap((searchList: FriendManagementModel[]) => searchList)
        .flatMap((searchItem: FriendManagementModel) => {
          return this.generateButtonList(searchItem).map((generatedButtonList: FriendshipStatusModel[]) => {
            index++;
            console.log("index = " + index);
            console.log("searchuser generatedButtonList = " + JSON.stringify(generatedButtonList));
            let friendManagementViewModel = new FriendManagementViewModel(searchItem.userId, searchItem.userName, searchItem.friendshipStatus, generatedButtonList, searchItem.isReceived, searchItem.thumbnailPath);
            console.log("friendManagementViewModel  = " + friendManagementViewModel );
            friendManagementViewModelList.push(friendManagementViewModel );
            return friendManagementViewModelList;
          })
        })        
    })
  }

  public generateButtonList(model: FriendManagementModel): Observable<FriendshipStatusModel[]> {
    let friendshipStatusModelList: FriendshipStatusModel[] = new Array() as Array<FriendshipStatusModel>;
    if (model.friendshipStatus == 0 && model.isReceived) {
      return this.translate.get("ACCEPT_FRIENDSHIP").flatMap((acceptFriendshipText: string) => {
        return this.translate.get("REFUSE_FRIENDSHIP").map((refuseFriendshipText: string) => {
          friendshipStatusModelList.push(new FriendshipStatusModel(FriendshipStatus.Accepted, acceptFriendshipText, false));
          friendshipStatusModelList.push(new FriendshipStatusModel(FriendshipStatus.Declined, refuseFriendshipText, false));

          return friendshipStatusModelList;
        })
      })
    } else if (model.friendshipStatus == 0 && model.isReceived == false) {      
      return this.translate.get("WAITING_RESPONSE").map((waitingResponseText: string) => {
        friendshipStatusModelList.push(new FriendshipStatusModel(FriendshipStatus.Waiting, waitingResponseText, true));

        return friendshipStatusModelList;
      })
    } else if (model.friendshipStatus == 1) {
      return this.translate.get("YOU_ARE_FRIEND").flatMap((yourFriendText: string) => {
        return this.translate.get("UNFRIEND").map((unfriendText: string) => {
          friendshipStatusModelList.push(new FriendshipStatusModel(FriendshipStatus.Accepted, yourFriendText, true));
          friendshipStatusModelList.push(new FriendshipStatusModel(null, unfriendText, false));

          return friendshipStatusModelList;
        })
      })
    } else if (model.friendshipStatus == 2 && model.isReceived == true) {      
      return this.translate.get("ADD_FRIEND").map((addFriendText: string) => {
        friendshipStatusModelList.push(new FriendshipStatusModel(FriendshipStatus.Waiting, addFriendText, false));

        return friendshipStatusModelList;
      })
    } else if (model.friendshipStatus == 2 && model.isReceived == false) {
      return this.translate.get("WAITING_RESPONSE").map((waitingResponseText: string) => {
        friendshipStatusModelList.push(new FriendshipStatusModel(FriendshipStatus.Waiting, waitingResponseText, true));

        return friendshipStatusModelList;
      })
    } else if (!model.friendshipStatus && !model.isReceived) {
      return this.translate.get("ADD_FRIEND").map((addFriendText: string) => {
        friendshipStatusModelList.push(new FriendshipStatusModel(FriendshipStatus.Waiting, addFriendText, false));

        return friendshipStatusModelList;
      })
    } 
  }

  public handleFriendshipStatus(userId: number, friendshipStatus: number, friendId: number): Observable<FriendManagementViewModel[]> {
    let body: FriendshipListViewModel = new FriendshipListViewModel(userId, friendId, friendshipStatus);
    return this.http.authorizedPost("api/Friend/UpdateFriendshipStatus", JSON.stringify(body), null).flatMap((res: Response) => {
      let response: HttpResponseSuccessModel = res.json();
      return this.friendshipList().map(x => x);
    })
  }
}
