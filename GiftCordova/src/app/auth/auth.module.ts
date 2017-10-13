import { Injector } from "@angular/core";
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, App } from 'ionic-angular';
import { AuthenticationTabComponent } from './authentication-tab/authentication-tab.component.ts'
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './registration/register.component';

import { File } from '@ionic-native/file';
import { Crop } from '@ionic-native/crop';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { TranslateModule } from '@ngx-translate/core';
import { Http, RequestOptions, XHRBackend, HttpModule } from '@angular/http';
import { InterceptedHttp } from './../interceptors/http.interceptor';
import { IAppConfig, AppConfig, APP_CONFIG } from '../app.config';
import { httpFactory } from './../interceptors/http.factory';
import { AccountService } from './shared/account.service';
import { Dialogs } from '@ionic-native/dialogs';
import { LocalizationService } from './../services/localization/localization.service';

@NgModule({
    declarations: [
        AuthComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        IonicModule.forRoot(AuthComponent),
        TranslateModule
    ],
    entryComponents: [
        AuthComponent,
        LoginComponent,
        RegisterComponent
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        File,
        Crop,
        FilePath,
        FileTransfer,
        Camera,
        Dialogs,
        AccountService,
        {
            provide: APP_CONFIG,
            useValue: AppConfig
        },
        {
            provide: InterceptedHttp,
            useFactory: httpFactory,
            deps: [XHRBackend, RequestOptions, Injector, LocalizationService, App]
        }]
    })
export class AuthModule { }
