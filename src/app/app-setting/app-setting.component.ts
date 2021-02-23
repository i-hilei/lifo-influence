import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { confirm, ConfirmOptions } from '@nativescript/core';
import { firebase } from '@nativescript/firebase';
import { ToastService } from '@services/toast.service';

@Component({
    selector: 'app-app-setting',
    templateUrl: './app-setting.component.html',
    styleUrls: ['./app-setting.component.scss'],
})
export class AppSettingComponent implements OnInit {
    constructor(private router: RouterExtensions, private toasty: ToastService) {}

    ngOnInit(): void {}

    showTermsOfUseModal() {
        this.router.navigate(['terms-of-use']);
    }

    async logOut() {
        const options: ConfirmOptions = {
            message: 'Are you sure to log out?',
            okButtonText: 'Logout',
            cancelButtonText: 'Cancel',
        };
        const isOk = await confirm(options);

        if (isOk) {
            firebase
                .logout()
                .then(() => {
                    this.router.navigate(['/auth/sign-in'], { clearHistory: true });
                })
                .catch((err) => {
                    this.toasty.show({ text: 'Log out failed, please try again' });
                    console.log(err);
                });
        }
    }
}
