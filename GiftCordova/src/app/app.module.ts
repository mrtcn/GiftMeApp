import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { APP_CONFIG, AppConfig } from './app.config';
import { MyApp } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { EventTabComponent } from './pages/home/tabs/event-tab.component';
import { EventDetailComponent } from './pages/event/event-detail/event-detail.component';
import { CreateEventComponent } from './pages/event/create-event/create-event.component';
import { CreateUpdateItemComponent } from './pages/item/item-create-update/item-create-update.component';
import { MenuComponent } from './pages/menu/menu.component';
import { EventService } from './services/event/event.service';
import { ItemService } from './services/item/item.service';
import { AuthModule } from './auth/auth.module';
import { LocalizationService } from './services/localization/localization.service';
import { Http, RequestOptions, XHRBackend, HttpModule } from '@angular/http';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app';


import { GiftDatePickerComponent } from './helpers/directives/datepicker/datepicker.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
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
    MenuComponent,
    GiftDatePickerComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: 'top' }),
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
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
    MenuComponent
  ],
  providers: [
      {
          provide: ErrorHandler,
          useClass: IonicErrorHandler
      },
      Dialogs,
      EventService,
      ItemService,
      LocalizationService]
})
export class AppModule {}
