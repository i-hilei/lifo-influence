import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { OfferDetail } from '@src/app/typings/campaign';
import { Utils, WebView, EventData } from '@nativescript/core';
import { layout } from '@nativescript/core/utils/utils';

declare const android;
@Component({
    selector: 'app-offer-detail-display',
    templateUrl: './offer-detail-display.component.tns.html',
    styleUrls: ['./offer-detail-display.component.tns.scss'],
})
export class OfferDetailDisplayComponent implements OnInit {
    height: number = 500;
    @Input() offerDetail: OfferDetail;

    constructor(private cdr: ChangeDetectorRef) {}

    async ngOnInit() {}

    open(link) {
        if (link.indexOf('http') !== 0) {
            link = `http://${link}`;
        }
        Utils.openUrl(link);
    }

    get showAmazonLink() {
        return this.offerDetail?.product_image_list?.length > 2 && this.offerDetail?.product_image_list[2];
    }

    get showShopifyLink() {
        return this.offerDetail?.product_image_list?.length > 2 && this.offerDetail?.product_image_list[1];
    }

    get showTextLink() {
        return this.offerDetail?.product_image_list?.length > 3 && this.offerDetail?.product_image_list[3];
    }

    onWebViewLoadFinished(event: EventData) {
        const webView = <WebView>event.object;
        const jsStr = `var body = document.body;
            var html = document.documentElement;
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = "img{width:100%};";
            body.appendChild(style)
            Math.max( body.scrollHeight, body.offsetHeight, 
            html.clientHeight, html.scrollHeight, html.offsetHeight);`;

        if (webView.ios) {
            webView.ios.scrollView.scrollEnabled = false;
            webView.ios.evaluateJavaScriptCompletionHandler(jsStr, (result, error) => {
                if (error) {
                    console.log('error...');
                } else if (result) {
                    this.height = layout.toDevicePixels(result);
                    this.cdr.detectChanges();
                }
            });
        } else if (webView.android) {
            // Works only on Android 19 and above
            webView.android.evaluateJavascript(
                jsStr,
                new android.webkit.ValueCallback({
                    onReceiveValue: (height) => {
                        this.height = layout.toDevicePixels(height);
                        this.cdr.detectChanges();
                    },
                })
            );
        }
    }
}
