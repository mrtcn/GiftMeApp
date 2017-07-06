import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LocalizationService {

    constructor( private  translate: TranslateService ) {}

    translateConfig() {
        var userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang = /(en|tr)/gi.test(userLang) ? userLang : 'en';
 
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('en');
 
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use(userLang);
      }
}