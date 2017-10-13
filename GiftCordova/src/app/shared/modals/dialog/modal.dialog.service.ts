import { Injectable, Injector } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './../../../auth/shared/account.service';
import { AuthComponent } from './../../../auth/auth.component';
import { DialogComponent } from './modal.dialog.component';


export interface IDialogModalService {
    displayDialogModalWithCulture(infoMessage: string, infoTitle: string);
    displayDialogModal(infoMessage: string, infoTitle: string);
}

@Injectable()
export class DialogModalService implements IDialogModalService {

    constructor(
        private translateService: TranslateService,
        private modalCtrl: ModalController,
        private accountService: AccountService,
        private injector: Injector) { }

    getAuthComponent(): AuthComponent {
        return this.injector.get(AuthComponent);
    }

    //getNavController(): NavController {
    //    return this.injector.get(NavController);
    //}

    displayDialogModalWithCulture(infoMessage: string, infoTitle: string = "INFO") {
        return this.translateService.get(infoTitle).flatMap(title => {
            return this.translateService.get(infoMessage).map(message => {
                this.dialogModalPresent(infoMessage, title);
                return true;
            });
        });
    }

    displayDialogModal(infoMessage: string, infoTitle: string = "INFO"): Observable<any> {
        console.log("displayDialogModal");
        if (infoTitle === 'INFO' || infoTitle === 'ERROR') {
            return this.translateService.get(infoTitle).map(title => {
                this.dialogModalPresent(infoMessage, title);
                return true;
            });
        } else {
            this.dialogModalPresent(infoMessage, infoTitle);
            return Observable.of(true);
        }
    }

    private dialogModalPresent(infoMessage: string, infoTitle: string) {

        let dialogModal = this.modalCtrl.create(DialogComponent, { "infoMessage": infoMessage, "infoTitle": infoTitle, "firstButtonText": "OK", "secondButtonText": "CANCEL" });
        dialogModal.present();
    }
}
