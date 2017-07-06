import { RequestOptions, Http, XHRBackend } from "@angular/http";
import { Dialogs } from '@ionic-native/dialogs';
import { Injector } from "@angular/core";
import { InterceptedHttp } from './http.interceptor';
export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, injector: Injector, dialogs: Dialogs): Http {
    return new InterceptedHttp(backend, defaultOptions, injector, dialogs);
}
