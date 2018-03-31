import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from './../../../auth/shared/account.service';
import { AuthComponent } from './../../../auth/auth.component';
import { DialogModalService } from './modal.dialog.service';
import { ModalController } from 'ionic-angular';

export function dialogModalFactory(translateService: TranslateService, modalCtrl: ModalController, injector: Injector): DialogModalService {
    return new DialogModalService(translateService, modalCtrl, injector);
}
