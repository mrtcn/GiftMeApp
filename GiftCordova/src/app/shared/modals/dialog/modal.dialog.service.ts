import { Injectable, Injector } from '@angular/core';
import { ModalController, Modal } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { DialogComponent } from './modal.dialog.component';
import { InterceptedHttp } from './../../../interceptors/http.interceptor';


export interface IDialogModalService {
  //displayDialogModalWithCulture(infoMessage: string, infoTitle: string, firstButtonText: string, secondButtonText: string, cb);
  displayDialogModal(infoMessage: string, infoTitle: string, firstButtonText: string, secondButtonText: string, cb);
}

@Injectable()
export class DialogModalService implements IDialogModalService {
    interceptedHttp: InterceptedHttp;
    constructor(
        private translateService: TranslateService,
        private modalCtrl: ModalController,
        private injector: Injector) { }

    getNavController(): InterceptedHttp {
      return this.injector.get(InterceptedHttp);
    }

    displayDialogModal(infoMessage: string, infoTitle: string = "INFO", firstButtonText: string, secondButtonText: string = null, cb) {
      console.log("firstButtonText = " + firstButtonText);

      return Observable.forkJoin(
        this.getTranslation(infoTitle),
        this.getTranslation(infoMessage),
        this.getTranslation(firstButtonText),
        this.getTranslation(secondButtonText),
        (infoTitle: string, infoMessage: string, firstButtonText: string, secondButtonText: string) => {
          console.log("concat entered result = " + infoTitle + " - " + infoMessage + " - " + firstButtonText + " - " + secondButtonText);

          let messageType: number = infoTitle == "INFO" ? 1 : 2;
          let dialogModal = this.dialogModalPresent(infoMessage, infoTitle, firstButtonText, secondButtonText, messageType);

          dialogModal.onDidDismiss(data => {
            console.log("onDidDismiss invoked");
            let http = this.getNavController();

            if (cb) {
              console.log("cb JSON = " + JSON.stringify(cb));
              cb().subscribe(x => x);
            }
          });

          return dialogModal;
        });
    }

    // messageType = 1:Info, 2:Error
    private dialogModalPresent(infoMessage: string, infoTitle: string, firstButtonText: string, secondButtonText: string, messageType: number): Modal {
      let cssClass: string = messageType == 1 ? "gift-modal gift-modal-info" : "gift-modal gift-modal-error";
      let dialogModal = this.modalCtrl.create(DialogComponent,
        { "infoMessage": infoMessage, "infoTitle": infoTitle, "firstButtonText": firstButtonText, "secondButtonText": secondButtonText },
        { showBackdrop: true, enableBackdropDismiss: false, cssClass: cssClass });
      
      dialogModal.present();

      return dialogModal;
    }

    private getTranslation(key: string): Observable<any> {
      if (!key)
        return Observable.of(null);

     return this.translateService.get(key).map(x => {
        console.log("key = " + x);
        return x;
      }, error => {
        console.log("key error = " + JSON.stringify(error));
        return Observable.of(null);
      }).catch(error => {
        console.log("key catch = " + JSON.stringify(error));
        return Observable.of(null);
      })
    }
}
