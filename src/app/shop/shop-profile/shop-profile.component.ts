import { Component, Input, OnInit } from '@angular/core';
import { copy } from '@src/app/shared/methods/copy';
import { FirebaseEventsService } from '@services/firebase-events.service';
import { environment } from '@src/environments/environment';
import { ToastService } from 'ng-zorro-antd-mobile';

@Component({
    selector: 'app-shop-profile',
    templateUrl: './shop-profile.component.html',
    styleUrls: ['./shop-profile.component.scss'],
})
export class ShopProfileComponent implements OnInit {
    @Input() shopDetail;
    @Input() type: 'internal' | 'external' = 'internal';

    copyModalShow = false;

    link = '';

    get backgroundImg() {
        return this.shopDetail?.shop_image_url || 'assets/png/shop-default-bg.png';
    }

    constructor(private firebaseEventsService: FirebaseEventsService, private toast: ToastService) {}

    ngOnInit(): void {
        // console.log(this.shopDetail);
        // localStorage.setItem('shopDetail', JSON.stringify(this.shopDetail));

    }

    copyShopLink() {
        const link = `${environment.shopHost}/${this.shopDetail.shop_url || this.shopDetail.shop_id}`;

        if (this.type === 'internal') {
            this.firebaseEventsService.logEvent({
                name: 'click_share_shop',
                properties: {
                    shop_id: this.shopDetail.shop_id,
                },
            });

            this.copyModalShow = true;
            let platform = 'instagram';
            let accountId = '';
            if (this.shopDetail.instagram_id) {
                accountId = this.shopDetail.instagram_id;
            } else if (this.shopDetail.tiktok_id) {
                platform = 'tiktok';
                accountId = this.shopDetail.tiktok_id;
            }

            if (accountId) {
                copy(link);
                this.link = link;
            }
        }

        if (this.type === 'external') {
            copy(link);
            this.toast.info('Store URL Copied!', 1500, null, false, 'top');
        }
    }

    onCopyModalClose() {
        this.copyModalShow = false;
    }
}
