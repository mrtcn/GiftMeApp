import { Component, ViewChild, Input } from '@angular/core';
import { Platform, Nav, MenuController, App } from 'ionic-angular';
import { AccountService } from '../../auth/shared/account.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthComponent } from '../../auth/auth.component';
import { ProfilePage } from '../profile/profile.component'

@Component({
    selector: 'menu-content',
    templateUrl: 'menu.html'
})
export class MenuComponent {

    @Input() isAuthenticated;

    constructor(private accountService: AccountService, private app: App, public menu: MenuController) {

    }

    navigateToProfile() {
        this.app.getActiveNav().push(ProfilePage);
    }

    logout() {
        console.log("logout clicked");
        this.accountService.logout().subscribe(x => {
            console.log("1");
            if (x) {
                console.log("2");
                this.menu.toggle();
                console.log("4");
                this.app.getRootNav().setRoot(AuthComponent);
            } else {
                console.log("3");
                console.log("failed");
                this.app.getRootNav().setRoot(AuthComponent);
            }
        });
    }
}