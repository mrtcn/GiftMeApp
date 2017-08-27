import { Injectable, Inject } from '@angular/core';
import { Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { InterceptedHttp } from './../../interceptors/http.interceptor';
import { HttpResponseSuccessModel, HttpResponseErrorModel } from './../../interceptors/http.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { File, IFile, DirectoryEntry, FileEntry } from '@ionic-native/file';
import { FileTransfer, FileTransferObject, FileUploadResult, FileUploadOptions } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Dialogs } from '@ionic-native/dialogs';
import { AccountService } from '../../auth/shared/account.service';
import { AccessTokenModel } from '../../auth/shared/account.model';
import { ItemViewModel, ItemListType, EventIdModel, ItemIdModel, CreateUpdateItemModel, ToggleBuyStatusModel } from './item.model';
import { TranslateService } from '@ngx-translate/core';

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
        private fileTransfer: FileTransfer,
        private file: File,
        private filePath: FilePath,
        private translate: TranslateService,
        private dialogs: Dialogs) { }

    /* Get Items depends on itemTypeId; 1: All, 2: Bought, 3: Left */
    public getItemList(eventId: number, itemTypeId: number): Observable<ItemViewModel[]> {
        var model = new EventIdModel(eventId);
        return this.http.authorizedPost('/api/GiftItem/GiftItemList', JSON.stringify(model), null)
            .map((res: Response) => {
                let httpResponse: HttpResponseSuccessModel = res.json();
                return httpResponse.content.filter(item => {
                    
                    if (!item || item.length === 0) {
                        return false;
                    }

                    if (itemTypeId === 1) {
                        return true;
                    } else if (itemTypeId === 2) {
                        return item.isBought === true;
                    } else if (itemTypeId === 3) {
                        return item.isBought !== true;
                    }
                });
            });       
    }

    public getItemById(itemId: number): Observable<ItemViewModel> {
        return this.accountService.getAccessTokenFromStorage().flatMap((x: AccessTokenModel) => {           
            var model = new ItemIdModel(itemId);
            return this.http.authorizedPost('/api/GiftItem/GetItemById', JSON.stringify(model), null).map((res: Response) => {
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

            const fileTransfer: FileTransferObject = this.fileTransfer.create();

            let url: string = '/api/GiftItem/CreateOrUpdateGiftItem';
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

    public toggleItemBuyStatus(id: number, isBought: boolean, giftStatus: number): Observable<ItemViewModel> {
        let buyGiftText: string = isBought ? 'BUY_GIFT' : 'UNDO_BUY_GIFT';
        let buyGiftTitleText: string = isBought ? 'BUY_GIFT_TITLE' : 'UNDO_BUY_GIFT_TITLE';

        return this.translate.get(buyGiftText).flatMap((buyGift: string) => {
            return this.translate.get(buyGiftTitleText).flatMap((buyGiftTitle: string) => {
                return this.translate.get('OK').flatMap((ok: string) => {
                    return this.translate.get('CANCEL').flatMap((cancel: string) => {
                        let dialogConfirmPromise: Promise<number> = this.dialogs.confirm(buyGift, buyGiftTitle, [ok, cancel]).then(x => x)
                            .catch(e => console.log('Warning displaying dialog', e));
                        let dialogConfirmObservable: Observable<number> = Observable.fromPromise(dialogConfirmPromise);
                        return dialogConfirmObservable.flatMap((x: number) => {
                            if (x == 1) {
                                let toggleBuyStatusModel = new ToggleBuyStatusModel(id, isBought);
                                let url: string = '/api/GiftItem/ToggleGiftItemBuyStatus';

                                return this.http.authorizedPost(url, JSON.stringify(toggleBuyStatusModel), null)
                                    .map((res: Response) => {
                                        let httpResponse: HttpResponseSuccessModel = res.json();
                                        return httpResponse.content;
                                    });
                            } else if (x == 0) {
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
}