import { Injectable, Inject } from '@angular/core';
import { Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { InterceptedHttp } from './../../interceptors/http.interceptor';
import { HttpResponseSuccessModel, HttpResponseErrorModel } from './../../interceptors/http.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { File, IFile, DirectoryEntry, FileEntry } from '@ionic-native/file';
import { Transfer, TransferObject, FileUploadResult, FileUploadOptions } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { AccountService } from '../../auth/shared/account.service';
import { AccessTokenModel } from '../../auth/shared/account.model';
import { HomeEventListViewModel, EventViewModel, EventListType, EventIdModel, CreateEventModel } from './event.model';

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
        private transfer: Transfer,
        private file: File,
        private filePath: FilePath) { }

    public getEventList(eventType: number): Observable<Array<HomeEventListViewModel>> {
        return this.accountService.getAccessTokenFromStorage().flatMap((x: AccessTokenModel) => {
            var model = new EventListType(eventType);
            return this.http.authorizedPost('/api/Event/EventList', JSON.stringify(model), null).map((res: Response) => {
                console.log("getEventList Status Code = " + res.status);
                let httpResponse: HttpResponseSuccessModel = res.json();
                return httpResponse.content;
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

    public createEvent(eventModel: CreateEventModel, targetPath: string, fileName: string): Observable<number> {

        let eventJson = JSON.stringify(eventModel);
        return this.accountService.getAccessTokenFromStorage().flatMap((x: AccessTokenModel) => {

            var options: FileUploadOptions = {
                fileKey: "file",
                fileName: fileName,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params: { 'data': eventJson },
                headers: { 'Authorization': "Bearer " + x.access_token }
            };

            const fileTransfer: TransferObject = this.transfer.create();

            let url: string = '/api/Event/CreateOrUpdateEvent';
            // Use the FileTransfer to upload the image
            let uploadThen = fileTransfer.upload(targetPath, url, options).then();
            let uploadObservable: Observable<FileUploadResult> = Observable.fromPromise(uploadThen);

            return uploadObservable.map((fileUploadResult: FileUploadResult) => {
                    //Login User && GetToken

                let eventId = JSON.parse(fileUploadResult.response);
                    return eventId;
                },
                error => {
                    return null;
                }
            );
        });
    }
}