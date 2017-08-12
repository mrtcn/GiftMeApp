import { Injectable, Inject, Injector } from "@angular/core";
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers, XHRBackend } from "@angular/http";
import { Dialogs } from '@ionic-native/dialogs';
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";
import { InAppBrowser, Facebook, NativeStorage } from 'ionic-native';
import { IAppConfig, APP_CONFIG } from '../app.config';
import { StoredUserModel, AccessTokenModel } from '../auth/shared/account.model';
import { AccountService } from './../auth/shared/account.service';
import { HttpResponseErrorModel, HttpResponseSuccessModel } from './http.model'

@Injectable()
export class InterceptedHttp extends Http {
    user: Promise<StoredUserModel>;
    accountService: AccountService;

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private injector: Injector, private dialogs: Dialogs) {        
        super(backend, defaultOptions);        
    }

    getAccountService(): AccountService {
        return this.injector.get(AccountService);
    }

    getGlobalConfig(): IAppConfig {
        return this.injector.get(APP_CONFIG);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {        
        return super.request(url, options);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        if (this.user) {
            return new Observable<Response>()
        }
        url = this.updateUrl(url);
        return super.get(url, this.getRequestOptionArgs(options)).map(x => x).catch(error => {
            let errorResponse: HttpResponseErrorModel = error._body;
            this.dialogs.alert(errorResponse.errorMessage)
                .then(() => console.log('Dialog dismissed'))
                .catch(e => console.log('Error displaying dialog', e));

            return null;
        });;
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.post(url, body, this.getRequestOptionArgs(options)).map((res: Response) => {
            console.log("authorizedPost res = " + res.text());

            if (res.status >= 200 && res.status <= 300) {
                let successResponse: HttpResponseSuccessModel = res.json();
                if (successResponse.code == 1234) {
                    this.dialogs.alert(successResponse.message)
                        .then(() => console.log('Dialog dismissed'))
                        .catch(e => console.log('Warning displaying dialog', e));
                }
            }
            return res;
        }, error => {
            console.log("AuthorizedPost Exception = " + JSON.stringify(error));                        
            this.dialogs.alert("Unknown error occured.")
                .then(() => console.log('Dialog dismissed'))
                .catch(e => console.log('Error displaying dialog', e));

            return null;
        }).catch(error => {
            console.log("AuthorizedPost Exception = " + JSON.stringify(error));
            let errorResponse: HttpResponseErrorModel = error._body;
            console.log("AuthorizedPost Exception errorResponse = " + JSON.stringify(errorResponse));
            this.dialogs.alert(errorResponse.errorMessage, errorResponse.errorContent)
                .then(() => console.log('Dialog dismissed'))
                .catch(e => console.log('Error displaying dialog', e));

            return null;
        });
    }

    authorizedPost(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        
        url = this.updateUrl(url);
        return this.addAuthorizationHeaders(options).flatMap((x: RequestOptionsArgs) => {
            return super.post(url, body, x).map((res: Response) => {
                console.log("authorizedPost res = " + res.text());

                if (res.status >= 200 && res.status <= 300) {                   
                    let successResponse: HttpResponseSuccessModel = res.json();                   
                    if (successResponse.code == 1234) {
                        this.dialogs.alert(successResponse.message)
                            .then(() => console.log('Dialog dismissed'))
                            .catch(e => console.log('Warning displaying dialog', e));
                    }
                }               
                return res;
            }).catch(error => {
                console.log("AuthorizedPost Exception = " + JSON.stringify(error));
                let errorResponse: HttpResponseErrorModel = error._body;
                console.log("AuthorizedPost Exception errorResponse = " + JSON.stringify(errorResponse));
                this.dialogs.alert(errorResponse.errorMessage)
                    .then(() => console.log('Dialog dismissed'))
                    .catch(e => console.log('Error displaying dialog', e));

                return null;
            });
        })            
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.put(url, body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.delete(url, this.getRequestOptionArgs(options));
    }

    private updateUrl(req: string) {
        return this.getGlobalConfig().baseEndpoint + req;
    }

    private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        if (!options.headers.get("Content-Type")) {
            options.headers.append('Content-Type', 'application/json');
        }
        return options;
    }


    private addAuthorizationHeaders(options?: RequestOptionsArgs): Observable<RequestOptionsArgs> {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }        
        return this.getAccountService().getAccessTokenFromStorage().map((accessToken: AccessTokenModel) => {
            if (!options.headers.get("Content-Type")) {
                options.headers.append('Content-Type', 'application/json');
            }
            
            options.headers.append('Authorization', 'Bearer ' + accessToken.access_token);
            return options;
        })
        
    }
}