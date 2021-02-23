import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CampaignInvitationComponent } from './campaign-invitation/campaign-invitation.component';

import { SharedModule } from '@shared/shared.module';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ModalModule } from 'ng-zorro-antd-mobile';

@NgModule({
    declarations: [CampaignInvitationComponent],
    imports: [CommonModule, FormsModule, SharedModule, NzRadioModule, ModalModule],
})
export class PublicPageModule {}
