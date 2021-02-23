import { Component } from '@angular/core';
import { firebase } from '@nativescript/firebase';
import { LocalNotifications } from '@nativescript/local-notifications';
import { handleOpenURL, AppURL } from 'nativescript-urlhandler';
import { RouterExtensions, registerElement } from '@nativescript/angular';

import { ProfileService } from '@services/profile.service';
import { BackAppHandlersService, ConnectType } from '@services/back-app-handlers.service';
import { ProfileModel } from '@models/profile.model';

import { ExtendedShowModalOptions, ModalStack, overrideModalViewMethod } from 'nativescript-windowed-modal';

overrideModalViewMethod();
registerElement('ModalStack', () => ModalStack);

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    onAuthStateChanged = (authState: firebase.AuthStateData) => {
        if (authState.user) {
        }
    };

    config: firebase.InitOptions = { onAuthStateChanged: this.onAuthStateChanged };

    constructor(
        private profileService: ProfileService,
        private backAppHandlerService: BackAppHandlersService,
        private router: RouterExtensions
    ) {}

    ngOnInit() {
        // init firebase
        firebase.init(this.config);

        // when app opened by url
        handleOpenURL((appURL: AppURL) => {
            const type: ConnectType = appURL.params.get('type') as ConnectType;
            switch (type) {
                case ConnectType.paypal:
                    const code = appURL.params.get('code');
                    this.backAppHandlerService.connectPaypalHandler(code);
                    break;
                case ConnectType.instagram:
                    this.backAppHandlerService.connectInsagramHandler();
                    break;
                case ConnectType.tiktok:
                    this.backAppHandlerService.conectTiktokHandler();
                    break;
            }
        });

        // Firebase receive notification
        firebase.addOnMessageReceivedCallback(function (message) {
            console.log(message);
        });

        this.profileService
            .getCurrentProfile()
            .then((profile) => {
                console.log(profile);
                this.profileService.currentProfile = new ProfileModel(profile);
                if (!this.profileService.currentProfile.is_instagram_checked) {
                    this.profileService.checkInstagram();
                }
            })
            .catch((err) => console.log(err));
    }

    // ngOnInit() {
    //     LocalNotifications.hasPermission().then((res) => {
    //         LocalNotifications.schedule([
    //             { title: 'The first time', subtitle: 'Immediatly', body: 'This is the test body', forceShowWhenInForeground: true },
    //         ]);
    //         LocalNotifications.schedule([
    //             {
    //                 title: 'The second time',
    //                 subtitle: '3s',
    //                 body: 'This is the test body',
    //                 forceShowWhenInForeground: true,
    //                 at: new Date(new Date().getTime() + 1000 * 3),
    //             },
    //         ]);
    //         LocalNotifications.schedule([
    //             {
    //                 title: 'The third time',
    //                 subtitle: '10s',
    //                 body: 'This is the test body',
    //                 forceShowWhenInForeground: true,
    //                 at: new Date(new Date().getTime() + 1000 * 10),
    //             },
    //         ]);
    //     });
    // }
}
