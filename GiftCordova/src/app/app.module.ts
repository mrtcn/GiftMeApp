import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
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
import { EventService } from './services/event/event.service';
import { ItemService } from './services/item/item.service';
import { AuthModule } from './auth/auth.module';
import { LocalizationService } from './services/localization/localization.service';
import { Http, RequestOptions, XHRBackend, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app';
import { ImageHandler } from './helpers/image.helper';
import { imageHandlerFactory } from './helpers/image.helper.factory';

import { GiftDatePickerComponent } from './helpers/directives/datepicker/datepicker.component';



import { ActionSheetController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Crop } from '@ionic-native/crop';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';


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
    GiftDatePickerComponent
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
    HomeComponent,
    EventTabComponent,
    EventDetailComponent,
    CreateEventComponent,
    CreateUpdateItemComponent,
    EventDetailItemsComponent,
    MenuComponent
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
      LocalizationService]
})
export class AppModule {}
