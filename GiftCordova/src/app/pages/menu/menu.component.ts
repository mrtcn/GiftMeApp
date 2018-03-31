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
      this.menu.toggle();
      this.accountService.logout().subscribe(x => {
        this.app.getRootNav().setRoot(AuthComponent);
      });
    }
}
