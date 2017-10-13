import { Injectable, Inject, Injector } from "@angular/core";
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers, XHRBackend } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { environment } from "../environments/environment";
import { InAppBrowser, Facebook, NativeStorage } from 'ionic-native';
import { IAppConfig, APP_CONFIG } from '../app.config';
import { StoredUserModel, AccessTokenModel } from '../auth/shared/account.model';
import { AccountService } from './../auth/shared/account.service';
import { AuthComponent } from './../auth/auth.component';
import { HttpResponseErrorModel, HttpResponseSuccessModel } from './http.model'
import { LocalizationService } from './../services/localization/localization.service';
import { DialogModalService } from './../shared/modals/dialog/modal.dialog.service';
import { NavController, App } from 'ionic-angular';

@Injectable()
export class InterceptedHttp extends Http {
    user: Promise<StoredUserModel>;

    constructor(
        private backend: ConnectionBackend,
        private defaultOptions: RequestOptions,
        private injector: Injector,
        private localizationService: LocalizationService,
        private app: App) {
        super(backend, defaultOptions);
    }

    getDialogModalService(): DialogModalService {
        return this.injector.get(DialogModalService);
    }

    navCtrl(): NavController {
        return this.app.getRootNav();
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
            let errorResponse: any = error._body;
            return this.getDialogModalService().displayDialogModal(errorResponse.message, "ERROR").map(x => {
                return null;
            });
        });
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.post(url, body, this.getRequestOptionArgs(options)).map((res: Response) => {
            console.log("authorizedPost res = " + res.text());

            if (res.status >= 200 && res.status <= 300) {
                let successResponse: HttpResponseSuccessModel = res.json();
                if (successResponse.code == 1234) {
                    return this.getDialogModalService().displayDialogModalWithCulture(successResponse.message)
                }
            }
            return res;
        }, error => {
            console.log("AuthorizedPost Exception = " + JSON.stringify(error));
            this.getDialogModalService().displayDialogModalWithCulture("UNKNOWN_ERROR_TITLE", "UNKNOWN_ERROR_MESSAGE");            

            return null;
        }).catch(error => {
            console.log("AuthorizedPost Exception = " + JSON.stringify(error));
            let errorResponse: any = JSON.parse(error._body);
            console.log("AuthorizedPost Exception errorResponse = " + JSON.stringify(errorResponse));
            return this.getDialogModalService().displayDialogModal(errorResponse.message, "ERROR").map(x => {
                return null;
            });
        });
    }

    authorizedPost(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        console.log("authorizedPost");
        url = this.updateUrl(url);
        console.log("authorizedPost url = " + url);

        //return this.getDialogService()
        //    .displayDialog("Lorem Ipsum dolor amet", "ERROR")
        //    .map(x => {
        //        console.log("localizationService 1");
        //        return null;
        //    });     
        return this.addAuthorizationHeaders(options).flatMap((x: RequestOptionsArgs) => {
            console.log("addAuthorizationHeaders options success = " + JSON.stringify(x));
            return super.post(url, body, x).map((res: Response) => {
                console.log("authorizedPost res = " + res.text());

                if (res.status >= 200 && res.status <= 300) {                   
                    let successResponse: HttpResponseSuccessModel = res.json();                   
                    if (successResponse.code == 1234) {
                        this.getDialogModalService().displayDialogModalWithCulture(successResponse.message);
                    }
                }               
                return res;
            }).catch(error => {
                console.log("AuthorizedPost Exception 2 = " + JSON.stringify(error));
                let errorResponse: any = JSON.parse(JSON.stringify(error));
                let bodyResponse: any = JSON.parse(errorResponse._body);
                console.log("AuthorizedPost bodyResponse 2 = " + JSON.stringify(bodyResponse));
                let status: string = errorResponse.status;
                console.log("AuthorizedPost status 2 = " + JSON.stringify(status));

                return this.getDialogModalService()
                    .displayDialogModal(bodyResponse.message, "ERROR")
                    .map(y => {
                        console.log("localizationService 2");
                        return true;
                        //return this.getAccountService().logout().map(z => {
                        //    console.log("localizationService 4");
                        //    console.log("localizationService 5");
                        //    // DON'T USE NAVCONTROLLER IN SERVICES!
                        //    this.navCtrl().push(AuthComponent);
                        //    console.log("navigate to xxx");
                        //    return true;
                        }).catch(error => {
                            console.log("localizationService 6 = " + error);
                            return Observable.of(false);
                        });
                        
                    });                
            //});
        })
    }

    //navigateToAuth() {
    //    console.log("navigateToAuth has been called");
    //}

    navigateToAuth(): Observable<boolean> {
        console.log("localizationService 3");
        return this.getAccountService().logout().map(z => {
            console.log("localizationService 4");
            let nav: NavController = this.navCtrl();
            console.log("localizationService 5");
          nav.setRoot(AuthComponent);
          console.log("navigate to xxx");
          return true;
        }).catch(error => {
            console.log("localizationService 6");
            return Observable.of(false);
        });
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
        console.log("addAuthorizationHeaders options = " + options);
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        return this.getAccountService().getAccessTokenFromStorage().map((accessToken: AccessTokenModel) => {
            console.log("addAuthorizationHeaders accessToken = " + JSON.stringify(accessToken));
            if (!options.headers.get("Content-Type")) {
                options.headers.append('Content-Type', 'application/json');
            }
            
            options.headers.append('Authorization', 'Bearer ' + accessToken.access_token);
            return options;
        })
        
    }

}
