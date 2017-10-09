import { RequestOptions, Http, XHRBackend } from "@angular/http";
import { Injector } from "@angular/core";
import { InterceptedHttp } from './http.interceptor';
import { LocalizationService } from './../services/localization/localization.service';
import { NavController } from 'ionic-angular';

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, injector: Injector, localizationService: LocalizationService): Http {
    return new InterceptedHttp(backend, defaultOptions, injector, localizationService);
}
