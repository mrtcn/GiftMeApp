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
import { ItemViewModel, ItemListType, ItemIdModel, CreateUpdateItemModel } from './item.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class ItemService {
    private accessToken: string;

    private _loginResult = new BehaviorSubject<boolean>(false);
    public loginResult = this._loginResult.asObservable();

    constructor(
        private http: InterceptedHttp,
        private accountService: AccountService,
        private transfer: Transfer,
        private file: File,
        private filePath: FilePath) { }

    public getItemList(eventId: number): Observable<Array<ItemViewModel>> {
            var model = new ItemIdModel(eventId);
            return this.http.authorizedPost('/api/GiftItem/GiftItemListByEventId', JSON.stringify(model), null).map((res: Response) => {
                console.log("getItemList Status Code = " + res.status);
                let httpResponse: HttpResponseSuccessModel = res.json();
                return httpResponse.content;
        });       
    }

    public getItemById(itemId: number): Observable<ItemViewModel> {
        return this.accountService.getAccessTokenFromStorage().flatMap((x: AccessTokenModel) => {           
            var model = new ItemIdModel(itemId);
            return this.http.authorizedPost('/api/Item/GetItemById', JSON.stringify(model), null).map((res: Response) => {
                console.log("getItemList Status Code = " + res.status);
                let httpResponse: HttpResponseSuccessModel = res.json();
                return httpResponse.content;
            });
        });
    }

    public createUpdateItem(itemModel: CreateUpdateItemModel, targetPath: string, fileName: string): Observable<number> {

        let itemJson = JSON.stringify(itemModel);
        return this.accountService.getAccessTokenFromStorage().flatMap((x: AccessTokenModel) => {

            var options: FileUploadOptions = {
                fileKey: "file",
                fileName: fileName,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params: { 'data': itemJson },
                headers: { 'Authorization': "Bearer " + x.access_token }
            };

            const fileTransfer: TransferObject = this.transfer.create();

            let url: string = '/api/Item/CreateOrUpdateItem';
            // Use the FileTransfer to upload the image
            let uploadThen = fileTransfer.upload(targetPath, url, options).then();
            let uploadObservable: Observable<FileUploadResult> = Observable.fromPromise(uploadThen);

            return uploadObservable.map((fileUploadResult: FileUploadResult) => {
                    //Login User && GetToken

                let itemId = JSON.parse(fileUploadResult.response);
                    return itemId;
                },
                error => {
                    return null;
                }
            );
        });
    }
}