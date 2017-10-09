import { Injectable, Injector } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './../../auth/shared/account.service';
import { AuthComponent } from './../../auth/auth.component';
import { NavController } from 'ionic-angular';

export interface IDialogService {
    displayDialogWithCulture(infoMessage: string, infoTitle: string);
    displayDialog(infoMessage: string, infoTitle: string);
}

@Injectable()
export class DialogService implements IDialogService {

    constructor(
        private translateService: TranslateService,
        private dialogs: Dialogs,
        private accountService: AccountService,
        private injector: Injector,
        private navController: NavController) { }

    getAuthComponent(): AuthComponent {
        return this.injector.get(AuthComponent);
    }

    displayDialogWithCulture(infoMessage: string, infoTitle: string = "INFO", onDismissFunc = null) {
        this.translateService.get(infoTitle).flatMap(title => {
            return this.translateService.get(infoMessage).flatMap(message => {
                return this.dialogObservable(infoMessage, title, onDismissFunc).map(x => {
                    return null;
                });
            });
        });
    }

    displayDialog(infoMessage: string, infoTitle: string = "INFO", onDismissFunc = null): Observable<any> {
        console.log("displayDialog");
        if (infoTitle === 'INFO' || infoTitle === 'ERROR') {
            return this.translateService.get(infoTitle).flatMap(title => {
                return this.dialogObservable(infoMessage, title, onDismissFunc).map(x => {
                    return null;
                });
            });
        } else {
            return this.dialogObservable(infoMessage, infoTitle, onDismissFunc).map(x => {
                return null;
            });
        }
    }

    private dialogObservable(infoMessage: string, infoTitle: string, onDismissFunc = null): Observable<any> {
        let dialogPromise: Promise<any> = this.dialogs.alert(infoMessage, infoTitle)
            .then(() => {
                console.log('Dialog dismissed');
                console.log('Dialog onDismissFunc = ' + JSON.stringify(onDismissFunc));
                console.log('Dialog onDismissFunc 2 = ' + onDismissFunc);
                if (onDismissFunc) {
                    onDismissFunc();
                } else {
                    console.log('Dialog onDismissFunc is undefined !!!');
                }

            })
            .catch(e => console.log('Error displaying dialog', e));
        let dialogObservable: Observable<any> = Observable.fromPromise(dialogPromise);

        return dialogObservable;
    }
}
