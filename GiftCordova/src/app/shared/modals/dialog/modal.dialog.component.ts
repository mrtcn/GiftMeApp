import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'modal-dialog',
    styleUrls: ['/modal.dialog.scss'],
    templateUrl: 'modal.dialog.html',
})

export class DialogComponent {
    private _dialogTitle = new BehaviorSubject<string>(null);
    public dialogTitle = this._dialogTitle.asObservable();

    private _dialogMessage = new BehaviorSubject<string>(null);
    public dialogMessage = this._dialogMessage.asObservable();

    private _dialogFirstButton = new BehaviorSubject<string>(null);
    public dialogFirstButton = this._dialogFirstButton.asObservable();

    private _dialogSecondButton = new BehaviorSubject<string>(null);
    public dialogSecondButton = this._dialogSecondButton.asObservable();

    constructor(
        private navParams: NavParams,
        private viewCtrl: ViewController) {
        let firstButtonText = navParams.get("firstButtonText");
        let secondButtonText = navParams.get("secondButtonText");
        let infoTitle = navParams.get("infoTitle");
        let infoMessage = navParams.get("infoMessage");

        this._dialogTitle.next(infoTitle);
        this._dialogMessage.next(infoMessage);
        this._dialogFirstButton.next(firstButtonText);
        this._dialogSecondButton.next(secondButtonText);
    }

    ok() {
        console.log("OK Pressed");
        this.viewCtrl.dismiss({asd: "ok"});
    }

    cancel() {
        console.log("CANCEL Pressed");
        this.viewCtrl.dismiss({ asd: "canceş" });
    }
}
