import { NgModule, ErrorHandler, Injector } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, App } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { ModalController } from 'ionic-angular';
import { APP_CONFIG, AppConfig } from './app.config';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { MyApp } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { EventTabComponent } from './pages/home/tabs/event-tab.component';
import { EventDetailComponent } from './pages/event/event-detail/event-detail.component';
import { CreateEventComponent } from './pages/event/create-event/create-event.component';
import { EventDetailItemsComponent } from './pages/event/event-detail/tab-contents/event-detail-items.component';
import { CreateUpdateItemComponent } from './pages/item/item-create-update/item-create-update.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ProfilePage } from './pages/profile/profile.component';
import { ProfileInfoTab } from './pages/profile/tabs/profile-info-tab.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { FriendManagementComponent } from './pages/friend-management/friend.management.component';
import { ToolbarComponent } from './pages/shared/toolbar/toolbar.component';
import { FriendTabComponent } from './pages/profile/tabs/friend-tab.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

import { EventService } from './services/event/event.service';
import { ItemService } from './services/item/item.service';
import { AuthModule } from './auth/auth.module';
import { LocalizationService } from './services/localization/localization.service';
import { NotificationService } from './services/notification/notification.service';
import { FriendManagementService } from './services/friend-management/friend.management.service';
import { DialogModalService } from './shared/modals/dialog/modal.dialog.service';
import { DeviceInfoService } from './services/device-info/device.info.service';
import { DialogComponent } from './shared/modals/dialog/modal.dialog.component';
import { Http, RequestOptions, XHRBackend, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocalizedDatePipe } from './helpers/pipes/localized.date.pipe';

import { AppComponent } from './app';
import { ImageHandler } from './helpers/image.helper';
import { imageHandlerFactory } from './helpers/image.helper.factory';
import { dialogModalFactory } from './shared/modals/dialog/modal.dialog.factory';

import { GiftDatePickerComponent } from './helpers/directives/datepicker/datepicker.component';

import { AccountService } from './auth/shared/account.service';
import { AuthComponent } from './auth/auth.component';

import { ActionSheetController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Crop } from '@ionic-native/crop';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { InterceptedHttp } from './interceptors/http.interceptor';
import { httpFactory } from './interceptors/http.factory';

import { Push } from '@ionic-native/push';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/localization/', '.json');
}

@NgModule({
  exports: [
      TranslateModule
  ],
  declarations: [
    MyApp,    
    HomeComponent,
    EventTabComponent,
    EventDetailComponent,
    CreateEventComponent,
    CreateUpdateItemComponent,
    EventDetailItemsComponent,
    MenuComponent,
    GiftDatePickerComponent,
    DialogComponent,
    NotificationComponent,
    FriendManagementComponent,
    ToolbarComponent,
    FriendTabComponent,
    ForgotPasswordComponent,
    ProfilePage,
    ProfileInfoTab,
    LocalizedDatePipe
  ],
  imports: [
    BrowserModule,    
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: 'top' }),
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AuthComponent,
    HomeComponent,    
    EventTabComponent,
    EventDetailComponent,
    CreateEventComponent,
    CreateUpdateItemComponent,
    EventDetailItemsComponent,
    NotificationComponent,
    FriendManagementComponent,
    ToolbarComponent,
    FriendTabComponent,
    ForgotPasswordComponent,
    MenuComponent,
    DialogComponent,
    ProfilePage,
    ProfileInfoTab
  ],
  providers: [
      StatusBar,
      SplashScreen,
      { provide: ErrorHandler, useClass: IonicErrorHandler },
      {
          provide: ImageHandler,
          useFactory: imageHandlerFactory,
          deps: [Camera, Platform, FilePath, File, Crop, ToastController, FileTransfer, LoadingController, ActionSheetController, Dialogs, TranslateService]
      },      
      Dialogs,
      EventService,
      ItemService,
      NotificationService,
      FriendManagementService,
      LocalizationService,
      DeviceInfoService,
      Push,
      {
          provide: DialogModalService,
          useFactory: dialogModalFactory,
          deps: [TranslateService, ModalController, Injector]
      },
      {
        provide: InterceptedHttp,
        useFactory: httpFactory,
        deps: [XHRBackend, RequestOptions, Injector, LocalizationService, App]
      }]
})
export class AppModule {}
