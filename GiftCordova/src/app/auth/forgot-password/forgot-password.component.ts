import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, Platform, App } from 'ionic-angular';
import { AuthComponent } from '../auth.component';
import { AccountService } from '../shared/account.service';
import { EmailList, EmailModel } from '../shared/account.model';
import { DialogModalService } from '../../shared/modals/dialog/modal.dialog.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'forgot-password',
    templateUrl: 'forgot-password.html',
    styleUrls: ['/forgot-password.scss']
})

export class ForgotPasswordComponent {
    
    emailForm: FormGroup;
    email: FormControl;

    constructor(
      public navCtrl: NavController,
      private accountService: AccountService,
      private dialogModalService: DialogModalService,
      public formBuilder: FormBuilder) {
      this.createFormControl();
      this.createForm();      
    }

    public sendEmail(model: EmailModel, isValid: boolean) {
      this.accountService.forgotPassword(model, this.navToAuth.bind(this)).subscribe(x => {
        return x;                
      }, err => {
        console.log("sendEmail Error = " + JSON.stringify(err));
      });

    }

    navToAuth(): Observable<boolean> {
      return Observable.fromPromise(this.navCtrl.push(AuthComponent)).map(x => {
        return true
      });
    }

    private close() {
      this.navCtrl.pop();
    }

    createFormControl() {
      this.email = new FormControl('', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")])
    }

    createForm() {
      this.emailForm = new FormGroup({
        email: this.email
      });
    }
}

