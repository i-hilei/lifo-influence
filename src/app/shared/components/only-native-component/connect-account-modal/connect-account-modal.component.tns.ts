import { Component, OnInit } from '@angular/core';
import { openUrl } from '@nativescript/core/utils';
import { ProfileService } from '@services/profile.service';
import { ProfileModel } from '@models/profile.model';
import { ConnectType } from '@services/back-app-handlers.service';

@Component({
    selector: 'app-connect-account-modal',
    templateUrl: './connect-account-modal.component.tns.html',
    styleUrls: ['./connect-account-modal.component.tns.scss'],
})
export class ConnectAccountModalComponent implements OnInit {
    currentProfile: ProfileModel;
    appSchema = 'lifotest';

    get paypalLink() {
        const url = 'https://www.paypal.com/connect';
        const flowEntry = 'flowEntry=static';
        const client_id = 'client_id=AeEYineiLSnfASbu_s27_LBCnbXqSiQStIelMvi8XQ23Uk1FEqvJcW0PZXP-vKN7lkr5ydGvAUQqjXZj';
        const scope = 'scope=email%20address';
        const redirect_uri = `redirect_uri=${this.appSchema}://influencer.lifo.com?type=paypal`;
        return `${url}?${flowEntry}&${client_id}&${scope}&${redirect_uri}`;
    }

    constructor(private profileService: ProfileService) {}

    ngOnInit(): void {
        this.currentProfile = this.profileService.currentProfile;
    }

    connectWithPaypal() {
        openUrl(this.paypalLink);
    }
}
