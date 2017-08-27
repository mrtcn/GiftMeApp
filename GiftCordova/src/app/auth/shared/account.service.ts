﻿import { Facebook, NativeStorage } from 'ionic-native';
import { Injectable, Inject } from '@angular/core';
import { Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { InterceptedHttp } from './../../interceptors/http.interceptor'
import { HttpResponseSuccessModel, HttpResponseErrorModel } from './../../interceptors/http.model'
import { ImageHandler } from './../../helpers/image.helper';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RegisterApiModel, LoginViewModel, AccessTokenModel, UserInfo, IName, RegisterExternalBindingModel, StoredUserModel, IExternalAccessTokenBindingModel } from './account.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';

declare var cordova: any;

@Injectable()
export class AccountService {
    private accessToken: string;

    constructor(
        private http: InterceptedHttp,
        private imageHandler: ImageHandler) { }

    public getAccessTokenForExternalUser(providerKey: string, loginProvider: string, externalAccessToken: string): Observable<AccessTokenModel> {
        let accessTokenBindingModel: IExternalAccessTokenBindingModel =
        {
            providerKey: providerKey,
            loginProvider: loginProvider,
            externalAccessToken: externalAccessToken
        }
        let updateJson = JSON.stringify(accessTokenBindingModel);

        //ADD EXTERNAL ACCESS TOKEN INTO NATIVESTORAGE
        this.addExternalAccessTokenIntoStorage({ providerKey: providerKey, loginProvider: "Facebook", externalAccessToken: externalAccessToken });

        return this.http.post('/api/Account/ObtainLocalAccessToken', updateJson, null).flatMap((res: Response) => {
            console.log("getAccessTokenForExternalUser Status Code = " + res.status);
            let httpResponse: HttpResponseSuccessModel = res.json();
            //ADD ACCESS TOKEN INTO NATIVESTORAGE
            return this.addAccessTokenIntoStorage(httpResponse.content).map((x: boolean) => {
                if (x) {
                    return httpResponse.content;
                }
                return null;
            });
            
        }, () => {
            return null;
        });
    }
    
    public isAuthenticated(): Observable<boolean> {
        return this.getUserInfoFromCache().map((user: StoredUserModel) => {
            if (user == null) {
                return false;
            }
            return true;
        });            
    }

    public getUserInfoFromCache(): Observable<StoredUserModel> {
        //Get Access Token From LocalStorage        
        return this.getUserFromStorage().map((storedUserModel: StoredUserModel) => {
            return storedUserModel;
        }).catch(error => {
            console.log("GetUserInfoFromCache Exception Catch (returns null)");
            return null;
        });
    }

    public getUserInfo(): Observable<StoredUserModel> {
        //Get External Access Token From LocalStorage        
        let externalAccessTokenPromise: Promise<any> = NativeStorage.getItem('externalAccessToken').then(x => {
            return x;
        });
        let getExternalAccessTokenFromStorage: Observable<IExternalAccessTokenBindingModel> = Observable.fromPromise(externalAccessTokenPromise);
        return getExternalAccessTokenFromStorage.flatMap((x: IExternalAccessTokenBindingModel) => {
            return this.getAccessTokenFromStorage().flatMap((accessToken: AccessTokenModel) => {
                var externalBindingModel = JSON.stringify(x);
                return this.http.authorizedPost('/api/Account/ExternalUserInfo', externalBindingModel, null).flatMap((res: Response) => {
                    console.log("getUserInfo Status Code = " + res.status);
                    let httpResponse: HttpResponseSuccessModel = res.json();
                    //ADD USER INTO NATIVESTORAGE
                    return this.addUserIntoStorage(httpResponse.content).map((isSuccess: boolean) => {                        
                        return httpResponse.content;
                    });
                    
                });
            });
        }).catch(x => {
            return this.getAccessTokenFromStorage().flatMap((accessToken: AccessTokenModel) => {
                let headers = new Headers();
                headers.append("Authorization", "Bearer " + accessToken.access_token);
                let options = new RequestOptions({ headers: headers });
                return this.http.get('/api/Account/UserInfo', options).map((res: Response) => {
                    console.log("getUserInfo Status Code = " + res.status);
                    let httpResponse: HttpResponseSuccessModel = res.json();
                    //ADD USER INTO NATIVESTORAGE
                    let user: StoredUserModel = httpResponse.content;  
                    return this.addUserIntoStorage(user).map((isSuccess: boolean) => {
                        return user;
                    });
                });
            }).catch(error => {
                console.log("getAccessTokenFromStorage Exception");
                return null;
            });
        });
    }

    public updateUser(model: UserInfo): Observable<StoredUserModel> {
        //Get Token From LocalStorage
        let updateJson = JSON.stringify(model);
        return this.http.authorizedPost('/api/Account/UpdateUserInfo', updateJson, null).flatMap((res: Response) => {
            let httpResponse: HttpResponseSuccessModel = res.json();
            let storedUserModel: StoredUserModel = httpResponse.content;
            return this.addUserIntoStorage(storedUserModel).map((isSuccess: boolean) => {
                return storedUserModel;
            });
        });
    }

    public register(model: RegisterApiModel, targetPath: string, fileName: string): Observable<StoredUserModel> {

        let registerJson = JSON.stringify(model);


        //const fileTransfer: TransferObject = this.transfer.create();
       
        // Use the FileTransfer to upload the image
        if (!targetPath || !fileName) {

            let headers = new Headers({ "Content-Type": "application/json" });
            let options = new RequestOptions({ headers: headers });

            return this.http.post('api/Account/RegisterWithoutPhoto', registerJson, options).flatMap((storedUserModel: Response) => {
                //Login User && GetToken
                return this.login(new LoginViewModel(model.userName, model.password)).flatMap((x: boolean) => {
                    //ADD USER INTO NATIVESTORAGE
                    return this.addUserIntoStorage(storedUserModel.json()).map((isSuccess: boolean) => {
                        return storedUserModel.json();
                    });
                });
            });
        } else {

            var options = {
                fileKey: "file",
                fileName: fileName ? '' : fileName,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params: { 'data': registerJson }
            };

            let url: string = this.http.getGlobalConfig().baseEndpoint + 'api/Account/Register';

            return this.imageHandler.uploadImage(url, options).flatMap((storedUserModel: StoredUserModel) => {
                //Login User && GetToken
                return this.login(new LoginViewModel(model.userName, model.password)).flatMap((x: boolean) => {
                    //ADD USER INTO NATIVESTORAGE
                    return this.addUserIntoStorage(storedUserModel).map((isSuccess: boolean) => {
                        return storedUserModel;
                    });
                });
            }).catch(error => {
                console.log("Register UploadObservable Exception = " + JSON.stringify(error))
                return null;
            }); 
        }        
    }

    public registerExternal(model: RegisterExternalBindingModel): Observable<StoredUserModel> {

        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/Account/RegisterExternal', JSON.stringify(model), options).flatMap((res: Response) => {
            //ADD USER INTO NATIVESTORAGE
            return this.addUserIntoStorage(res.json()).flatMap((isSuccess: boolean) => {
                // ADD EXTERNAL ACCESSTOKEN AND ACCESSTOKEN INTO NATIVESTORAGE
                return this.getAccessTokenForExternalUser(model.providerKey,model.loginProvider,model.externalAccessToken).map(() => {
                    return res.json();
                });
            });
        });
    }

    public login(model: LoginViewModel): Observable<boolean> {
        
        let urlSearchParams = new URLSearchParams();        
        urlSearchParams.append('username', model.userName);
        urlSearchParams.append('password', model.password);
        urlSearchParams.append('grant_type', 'password');

        let body = urlSearchParams.toString();
        let headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
        headers.append("rejectUnauthorized", "false");

        let options = new RequestOptions({ headers: headers });

        return this.http.post('/Token', body, options).flatMap((res: Response) => {
            let accessToken: string = res.json().access_token;
            //ADD USER AND ACCESS TOKEN INTO NATIVESTORAGE
            console.log("Login User Info = " + res.json());

            return this.addAccessTokenIntoStorage(res.json()).flatMap((x: boolean) => {
                console.log("Login Add Access Success = " + x);
                if (x) {
                    return this.getUserInfo().flatMap((user: StoredUserModel) => {
                        return this.addUserIntoStorage(user).map((isSuccess: boolean) => {
                            let result: boolean = user != null;
                            return result;
                        });
                    });
                } else {
                    return null;
                }
            });
        }).catch(error => {
            console.log("token error = " + JSON.stringify(error));
            return null;
        });
    }

    public logout(): Observable<boolean> {

        let facebookLogoutPromise: Promise<any> = Facebook.logout();
        let facebookLogout: Observable<any> = Observable.fromPromise(facebookLogoutPromise);

        let removeAccountCachesPromise: Promise<any> = this.removeAccountCaches();
        let removeAccountCaches: Observable<any> = Observable.fromPromise(removeAccountCachesPromise);

        return this.getExternalAccessTokenFromStorage().flatMap((externalAccessToken: IExternalAccessTokenBindingModel) => {
                return Observable.of(true);
        }).flatMap(x => {
            return facebookLogout.map(logout => {
                return Observable.of(true);
                })
        }).flatMap(x => {
            return removeAccountCaches.map(x => {
                return x;
            });
        }).catch(error => {
            console.log("External Logout Exception");
            return removeAccountCaches.map(x => {
                return x;
            });
        });
    }

    public splitFullNameIntoParts(fullName: string): IName {
        if (!fullName) {
            return null;
        }
        let firstName = fullName.split(' ').slice(0, -1).join(' ');
        let lastName = fullName.split(' ').slice(-1).join(' ');

        let nameModel: IName = { firstName: firstName, lastName: lastName };

        return nameModel;
    }

    public addAccessTokenIntoStorage(accessToken: AccessTokenModel): Observable<boolean> {
        let removeAccessTokenPromise: Promise<any> = NativeStorage.remove('accessToken').then();
        let removeAccessObserable: Observable<any> = Observable.fromPromise(removeAccessTokenPromise);

        let accessTokenPromise: Promise<any> = NativeStorage.setItem('accessToken', accessToken).then();
        let accessObserable: Observable<any> = Observable.fromPromise(accessTokenPromise);

        return removeAccessObserable.flatMap(x => {
            return accessObserable.flatMap(y => {
                return Observable.of(true);
            }).catch(error => {
                return Observable.of(false);
            })
        }).catch(error => {
            return Observable.of(false);
        });
    }

    public addExternalAccessTokenIntoStorage(externalProviderModel: IExternalAccessTokenBindingModel) {
        NativeStorage.remove('externalAccessToken').then();
        NativeStorage.setItem('externalAccessToken', externalProviderModel).then();
    }

    public getAccessTokenFromStorage(): Observable<AccessTokenModel> {
        let accessTokenPromise: Promise<any> = NativeStorage.getItem('accessToken');
        let getAccessTokenFromStorage: Observable<AccessTokenModel> = Observable.fromPromise(accessTokenPromise);
        return getAccessTokenFromStorage.map(x => {
            return x;
        }).catch(x => {
                console.log("GetAccessTokenFromStorage Exception");
            return null;
        });
    }

    public getExternalAccessTokenFromStorage(): Observable<IExternalAccessTokenBindingModel> {
        let externalAccessTokenPromise: Promise<any> = NativeStorage.getItem('externalAccessToken');
        let getExternalAccessTokenFromStorage: Observable<IExternalAccessTokenBindingModel> = Observable.fromPromise(externalAccessTokenPromise);

        return getExternalAccessTokenFromStorage.map(x => {
            return x;
        }).catch(x => {
            console.log("GetExternalAccessTokenFromStorage Exception");
            return null;
        });
    }

    public getUserFromStorage(): Observable<StoredUserModel> {
        let userPromise: Promise<any> = NativeStorage.getItem('user');
        let getUserFromStorage: Observable<AccessTokenModel> = Observable.fromPromise(userPromise);
        return getUserFromStorage.map(x => {
            return x;
        }).catch(x => {
            console.log("GetUserFromStorage Exception");
            return null;
        });
    }

    public addUserIntoStorage(storedUserModel: StoredUserModel): Observable<boolean> {
        //now we have the users info, let's save it in the NativeStorage
        let removeUserPromise: Promise<any> = NativeStorage.remove('user');
        let removeUserObservable: Observable<any> = Observable.fromPromise(removeUserPromise);

        let setUserPromise: Promise<any> = NativeStorage.setItem('user',
            new StoredUserModel(
                storedUserModel.id,
                storedUserModel.userName,
                storedUserModel.email,
                storedUserModel.imagePath,
                storedUserModel.gender,
                storedUserModel.birthdate,
                null,
                null
            )
        );
        let setUserObservable: Observable<any> = Observable.fromPromise(setUserPromise);

        return removeUserObservable.map(x => {
            return x;
        }).flatMap(y => {
            return setUserObservable.map(result => {
                return Observable.of(true);
            });
        }).catch(error => {
            console.log("AddUserIntoStorage Exception = " + JSON.stringify(error));
            return Observable.of(false);
        });


    }

    public resetNativeStorageProperty(nativeStorageName: string, nativeStorageValue: any) {
        NativeStorage.remove(nativeStorageName).then();
        NativeStorage.setItem(nativeStorageName, nativeStorageValue).then();
    }

    public removeAccountCaches(): Promise<boolean> {
        return NativeStorage.remove('user').then(x => {
            return true;
        }).then(x => {
            return NativeStorage.remove('accessToken').then(x => {
                return true;
            });
        }).then(x => {
            return NativeStorage.remove('externalAccessToken').then(x => {
                return true;
            });
        }).catch(x => {
            console.log("RemoveAccountCaches Exception")
            return false;
        });
    }    
}