import { Injectable, Inject } from '@angular/core';
import { Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { InterceptedHttp } from './../../interceptors/http.interceptor';
import { HttpResponseSuccessModel, HttpResponseErrorModel } from './../../interceptors/http.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { File, IFile, DirectoryEntry, FileEntry } from '@ionic-native/file';
import { FileTransfer, FileTransferObject, FileUploadResult, FileUploadOptions } from '@ionic-native/file-transfer';
import { Dialogs } from '@ionic-native/dialogs';
import { FilePath } from '@ionic-native/file-path';
import { AccountService } from '../../auth/shared/account.service';
import { AccessTokenModel, StoredUserModel } from '../../auth/shared/account.model';
import { HomeEventListViewModel, EventViewModel, EventListType, EventIdModel, CreateEventModel, SearchEventListModel } from './event.model';
import { ImageHandler } from './../../helpers/image.helper';
import { TranslateService } from '@ngx-translate/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class EventService {
    private accessToken: string;

    private _loginResult = new BehaviorSubject<boolean>(false);
    public loginResult = this._loginResult.asObservable();

    constructor(
        private http: InterceptedHttp,
        private accountService: AccountService,
        private fileTransfer: FileTransfer,
        private file: File,
        private filePath: FilePath,
        private imageHandler: ImageHandler,
        private dialogs: Dialogs,
        private translate: TranslateService) {
        console.log("event service constructor");
    }

    public getEventList(eventType: number): Observable<Array<HomeEventListViewModel>> {
        console.log("getEventList Invoked");
            console.log("GetAccessTokenFromStorage Success");
            var model = new EventListType(eventType);
            return this.http.authorizedPost('/api/Event/EventList', JSON.stringify(model), null).map((res: Response) => {
                console.log("getEventList Status Code = " + res.status);
                let httpResponse: HttpResponseSuccessModel = res.json();
                return httpResponse.content;
            }, error => {
                console.log("eventList Error StatusCode BadRequest");
                return null;
             }).catch(x => {
                console.log("eventList Catch StatusCode BadRequest");
                return null;
            });
    }

    public searchEventList(eventType: number, searchTerm: string): Observable<Array<HomeEventListViewModel>> {
        return this.accountService.getAccessTokenFromStorage().flatMap((x: AccessTokenModel) => {
            var model = new SearchEventListModel(eventType, searchTerm);
            return this.http.authorizedPost('/api/Event/EventList', JSON.stringify(model), null).map((res: Response) => {
                console.log("getEventList Status Code = " + res.status);
                let httpResponse: HttpResponseSuccessModel = res.json();
                return httpResponse.content;
            }, error => {
                console.log("eventList Error StatusCode BadRequest");
                return null;
            }).catch(x => {
                console.log("eventList Catch StatusCode BadRequest");
                return null;
            });
        });
    }

    public getEventById(eventId: number): Observable<EventViewModel> {
        var model = new EventIdModel(eventId);
        return this.http.authorizedPost('/api/Event/GetEventById', JSON.stringify(model), null).map((res: Response) => {
            console.log("getEventById Status Code = " + res.status);
            let httpResponse: HttpResponseSuccessModel = res.json();
            return httpResponse.content;
        });
    }

    public addEventToFavorites(eventId: number, isFavorite: boolean): Observable<boolean> {

        let favoriteText: string = isFavorite ? 'REMOVE_FROM_FAVORITES_TEXT' : 'ADD_TO_FAVORITES_TEXT';
        let favoriteTitle: string = isFavorite ? 'REMOVE_FROM_FAVORITES_TITLE' : 'ADD_TO_FAVORITES_TITLE';

        return this.translate.get(favoriteText).flatMap((favoriteText: string) => {
            return this.translate.get(favoriteTitle).flatMap((favoriteTitle: string) => {
                return this.translate.get('OK').flatMap((ok: string) => {
                    return this.translate.get('CANCEL').flatMap((cancel: string) => {
                        let dialogConfirmPromise: Promise<number> = this.dialogs.confirm(favoriteText, favoriteTitle, [ok, cancel]).then(x => x)
                            .catch(e => console.log('Warning displaying dialog', e));
                        let dialogConfirmObservable: Observable<number> = Observable.fromPromise(dialogConfirmPromise);
                        return dialogConfirmObservable.flatMap((x: number) => {
                            if (x == 1) {
                                return this.http.authorizedPost('/api/Favorite/AddOrUpdateFavoriteEvent', JSON.stringify(new EventIdModel(eventId))).map((res: Response) => {
                                    let httpResponse: HttpResponseSuccessModel = res.json();
                                    return httpResponse.content;
                                })
                            } else if(x == 0) {
                                return null;
                            } else if (x == 2) {
                                return null;
                            }
                                
                        })                        
                    })
                })
            })
        });        
    }

    public createEvent(eventModel: CreateEventModel, targetPath: string, fileName: string): Observable<number> {

        let eventJson = JSON.stringify(eventModel);

        if (!targetPath || !fileName) {

            let url: string = 'api/Event/CreateOrUpdateWithoutImage';
            // Use the FileTransfer to upload the image
            return this.http.authorizedPost(url, eventJson).map((res: Response) => {
                let httpResponse: HttpResponseSuccessModel = res.json();
                return httpResponse.content;
            });
        } else {
            return this.accountService.getAccessTokenFromStorage().flatMap((x: AccessTokenModel) => {
                var options: FileUploadOptions = {
                    fileKey: "file",
                    fileName: fileName ? fileName : '',
                    chunkedMode: false,
                    mimeType: "multipart/form-data",
                    params: { 'data': eventJson },
                    headers: { 'Authorization': "Bearer " + x.access_token }
                };

                let url: string = this.http.getGlobalConfig().baseEndpoint + 'api/Event/CreateOrUpdate';

                return this.imageHandler.uploadImage(url, options).map((eventId: number) => {
                    return eventId;
                }).catch(error => {
                    return this.imageHandler.displayImageUploadError(error).flatMap(result => {                        
                        return Observable.throw(x => "Add Event Exception");
                    }).catch(error => {
                        console.log("Add Event Exception");
                        return Observable.throw(x => "Add Event Exception");
                    });  
                });
            });            
        }   
    }
}
