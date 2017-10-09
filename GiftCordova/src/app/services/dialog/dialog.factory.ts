import { Injector } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from './../../auth/shared/account.service';
import { AuthComponent } from './../../auth/auth.component';
import { DialogService } from './dialog.service';
import { NavController } from 'ionic-angular';

export function dialogFactory(translateService: TranslateService, dialogs: Dialogs, accountService: AccountService, injector: Injector, navController: NavController): DialogService {
    return new DialogService(translateService, dialogs, accountService, injector, navController);
}
