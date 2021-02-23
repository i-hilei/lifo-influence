import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ShopifyService } from '@src/app/services/shopify.service';
import { MessagesService } from '@src/app/shared/messages/messages.service';
import { MessageLevel, MessageType } from '@src/app/typings/system.typings';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { StoreTutorialComponent } from '@src/app/shop/store-tutorial/store-tutorial.component';
import { ProfileService } from '@src/app/services/profile.service';
import { ShopDetail } from '@src/app/shop/shop.type';
import { ShopService } from '../shop.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '@src/environments/environment';

enum AvailableTypes {
    popular = 'popular',
    highest_commission = 'highest_commission',
}

@Component({
    selector: 'app-select-product',
    templateUrl: './select-product.component.html',
    styleUrls: ['./select-product.component.scss'],
})
export class SelectProductComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    AVAILABLE_TYPES = AvailableTypes;
    shopProductList = [];
    remainingProductList = [];
    linkaddForm!: FormGroup;
    editLinkForm: FormGroup;
    submitted = false;
    loading = true;
    getshopdetails: any;
    valueChange = false;
    removeModalShow = false;
    selectedProduct: any;
    link_main: boolean = true;
    thumbnail: boolean = false;
    showaddForm: boolean = false;
    showEditForm: boolean = false;
    linksIndex: any;
    LinksNameId: any;
    showhidelinks = false;
    UpdatedLinksName = [];
    LastDownArrow: any;
    LimitLink: boolean;
    status: boolean;
    LinksName = [
        {
            id: 0,
            name: 'Free Link',
            path: '../../../assets/Link_icon/tinified/ic_freelink@2x.png',
            disable: false,
        },
        {
            id: 1,
            name: 'Instagram',
            path: '../../../assets/Link_icon/tinified/ic_instagram@2x.png',
            disable: false,
        },
        {
            id: 2,
            name: 'Facebook',
            path: '../../../assets/Link_icon/tinified/ic_facebook@2x.png',
            disable: false,
        },
        {
            id: 3,
            name: 'TikTok',
            path: '../../../assets/Link_icon/tinified/ic_tiktok@2x.png',
            disable: false,
        },
        {
            id: 4,
            name: 'Youtube',
            path: '../../../assets/Link_icon/tinified/ic_youtube@2x.png',
            disable: false,
        },
        {
            id: 5,
            name: 'Pinterest',
            path: '../../../assets/Link_icon/tinified/ic_pinterest@2x.png',
            disable: false,
        },
        {
            id: 6,
            name: 'Snapchat',
            path: '../../../assets/Link_icon/tinified/ic_snapchat@2x.png',
            disable: false,
        },
        {
            id: 7,
            name: 'Twitter',
            path: '../../../assets/Link_icon/tinified/ic_twitter@2x.png',
            disable: false,
        },
        {
            id: 8,
            name: 'Amazon',
            path: '../../../assets/Link_icon/tinified/ic_amazon@2x.png',
            disable: false,
        },
        {
            id: 9,
            name: 'Linkedin',
            path: '../../../assets/Link_icon/tinified/ic_linkedin@2x.png',
            disable: false,
        },
        {
            id: 10,
            name: 'FB Messenger',
            path: '../../../assets/Link_icon/tinified/ic_fbmessengar@2x.png',
            disable: false,
        },
        {
            id: 11,
            name: 'Twitch',
            path: '../../../assets/Link_icon/tinified/ic_twitch@2x.png',
            disable: false,
        },
        {
            id: 12,
            name: 'Esty',
            path: '../../../assets/Link_icon/tinified/ic_etsy@2x.png',
            disable: false,
        },
        {
            id: 13,
            name: 'Skype',
            path: '../../../assets/Link_icon/tinified/ic_skype@2x.png',
            disable: false,
        },

        {
            id: 14,
            name: 'Tumblr  ',
            path: '../../../assets/Link_icon/tinified/ic_tumblr@2x.png',
            disable: false,
        },
        {
            id: 15,
            name: 'Shopify',
            path: '../../../assets/Link_icon/tinified/ic_shopify@2x.png',
            disable: false,
        },
        {
            id: 16,
            name: 'Stroke',
            path: '../../../assets/Link_icon/tinified/ic_stroke@2x.png',
            disable: false,
        },
        {
            id: 17,
            name: 'Whatsapp',
            path: '../../../assets/Link_icon/tinified/ic_amazon@2x.png',
            disable: false,
        },
    ];

    selectedFirstTab: 'selections' | 'links' | 'settings' | 'report' | 'my_links' | 'my_products' = 'selections';
    currentActiveTab$: BehaviorSubject<AvailableTypes> = new BehaviorSubject<AvailableTypes>(AvailableTypes.popular);

    get shopDetail() {
        return this.shopService.cachedShopDetail;
    }
    set shopDetail(detail) {
        this.shopService.cachedShopDetail = detail;
    }

    get productList() {
        return this.shopService.cachedProductList;
    }
    set productList(list) {
        this.shopService.cachedProductList = list;
    }
    get backgroundImg() {
        return this.getshopdetails?.shop_image_url || 'assets/png/shop-default-bg.png';
    }

    constructor(
        private shopifyService: ShopifyService,
        private router: Router,
        private messagesService: MessagesService,
        private profileService: ProfileService,
        private modalService: NzModalService,
        private shopService: ShopService,
        private fb: FormBuilder,
        private nzMessageService: NzMessageService
    ) {
        this.getshopdetails?.links;
    }

    ngOnInit(): void {
        this.getdetails();
        if (!this.productList || !this.shopDetail) {
            this.fetchData().then(() => {
                this.loading = false;
                this.handleData();
            });
        } else {
            this.loading = false;
            this.handleData();
        }

        this.currentActiveTab$.pipe(takeUntil(this.unsubscribe)).subscribe((currentTab) => {
            switch (currentTab) {
                case AvailableTypes.popular:
                    this.remainingProductList = this.remainingProductList.sort((a, b) => {
                        return a.promoted ? -1 : 1;
                    });
                    break;
                case AvailableTypes.highest_commission:
                    this.remainingProductList = this.remainingProductList.sort((a, b) => {
                        return a.commission > b.commission ? -1 : 1;
                    });
                    break;
            }
        });
        this.linkaddForm = this.fb.group({
            title: [null, [Validators.required]],
            url: [null, [Validators.required]],
        });
        this.createLinkForm();
        this.EditForm();
    }

    getdetails() {
        this.shopifyService.getShopDetailInternal().then((data) => {
            this.getshopdetails = data;
            this.status = this.getshopdetails?.links[0]?.display;
            this.filter();
            this.LastDownArrow = data?.links?.length ? data?.links?.length - 1 : 0;
            if (this.getshopdetails?.links?.length > 3) {
                this.LimitLink = true;
            } else {
                this.LimitLink = false;
            }
        });
    }

    filter() {
        this.UpdatedLinksName = this.LinksName.map((link) => {
            const aaa = this.getshopdetails?.links?.filter((links) => links.arrayIndex === link.id);
            if (aaa.length > 0) {
                return { ...link, disable: true };
            } else {
                return link;
            }
        });
    }

    cancel(): void {}

    confirm(i: number) {
        delete this.getshopdetails.links[i];
        this.getshopdetails.links;

        const datalist = [];
        this.getshopdetails.links.forEach((ele) => {
            if (ele && ele != null && ele !== 'null') {
                datalist.push(ele);
            }
        });
        console.log(datalist);

        this.profileService.updateShopDetails({ links: datalist }).then((data) => (this.getshopdetails = data));
        this.filter();
        this.getdetails();
    }

    linkform(e) {
        this.LinksNameId = e;
        this.thumbnail = false;
        this.showaddForm = true;
        this.link_main = false;
    }

    onValueChange(value: boolean, i: number) {
        this.valueChange = value;
        this.getshopdetails.links[i]['display'] = this.valueChange;
        this.profileService.updateShopDetails({ links: this.getshopdetails.links });
    }

    onShowHideLinks(value: boolean) {
        this.showhidelinks = value;
        const links = [];
        this.getshopdetails.links.map((val: any) => {
            links.push({ arrayIndex: val.arrayIndex, display: value, title: val.title, url: val.url, used: val.used });
        });
        this.profileService.updateShopDetails({ links });
    }

    upArrow(i: number) {
        if (i >= 1) {
            const arr = this.getshopdetails.links;
            const element = arr[i];
            arr.splice(i, 1);
            arr.splice(i - 1, 0, element);
            this.profileService.updateShopDetails({ links: arr }).then((data) => (this.getshopdetails = data));
            this.ngOnInit();
        }
    }

    downArrow(i: number) {
        if (i <= this.getshopdetails.links.length) {
            const arr = this.getshopdetails.links;
            const element = arr[i];
            arr.splice(i, 1);
            arr.splice(i + 1, 0, element);
            this.profileService.updateShopDetails({ links: arr }).then((data) => (this.getshopdetails = data));
            this.ngOnInit();
        }
    }

    toggle() {
        this.link_main = true;
        this.thumbnail = false;
    }

    togglenewAdd() {
        if (this.getshopdetails.links.length > 3) {
            // this.LimitLink = true;
            this.ngOnInit();
        } else {
            this.link_main = false;
            this.thumbnail = true;
            this.UpdatedLinksName;
        }
    }
    cancelThumbnail() {
        this.link_main = true;
        this.thumbnail = false;
    }
    RenderFirst() {
        this.link_main = true;
        this.showaddForm = false;
    }
    ChangeLinkIcon() {
        this.UpdatedLinksName;
        this.thumbnail = true;
        this.showaddForm = false;
    }

    ChangeLinkEditIcon() {
        this.UpdatedLinksName;
        this.thumbnail = true;
        this.showEditForm = false;
    }

    showmainpage() {
        this.link_main = true;
        this.showEditForm = false;
    }

    openEditForm(e, title, url) {
        this.linksIndex = e;
        this.showEditForm = true;
        this.editLinkForm.get('title').setValue(title);
        this.editLinkForm.get('url').setValue(url);
        this.link_main = false;
    }
    createLinkForm() {
        this.linkaddForm = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(20)]],
            url: ['', [Validators.required]],
        });
    }

    EditForm() {
        this.editLinkForm = this.fb.group({
            title: ['', [Validators.required]],
            url: ['', [Validators.required]],
        });
    }

    get myForm() {
        return this.linkaddForm.controls;
    }
    SubmitEditForm() {
        console.log(this.editLinkForm.value);
        this.getshopdetails.links[this.linksIndex].title = this.editLinkForm.value.title;
        this.getshopdetails.links[this.linksIndex].url = this.editLinkForm.value.url;
        this.profileService.updateShopDetails({ links: this.getshopdetails.links }).then((data) => (this.getshopdetails = data));
        this.showEditForm = false;
        this.link_main = true;
    }
    submitForm(): void {
        this.submitted = true;
        if (this.linkaddForm.valid) {
            const links = [];
            if ('links' in this.getshopdetails) {
                this.getshopdetails.links.map((val: any) => {
                    links.push(val);
                });
            }

            links.push({
                title: this.linkaddForm.value.title,
                url: this.linkaddForm.value.url,
                display: true,
                arrayIndex: this.LinksNameId,
                used: true,
            });
            this.profileService.updateShopDetails({ links }).then((data) => (this.getshopdetails = data));
            this.getdetails();
            this.submitted = false;
            this.showaddForm = false;
            this.link_main = true;
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    editlinks(i: number, j: { title?: string; url?: string }) {
        this.getshopdetails.links;

        if (j.title) {
            document.getElementById(`${i}-title`).style.display = 'none';
            document.getElementById(`${i}-input-title`).setAttribute('type', 'text');
        }
        if (j.url) {
            document.getElementById(`${i}-url`).style.display = 'none';
            document.getElementById(`${i}-input-url`).setAttribute('type', 'text');
        }
    }
    FocusOut(i: number, j: { title?: string; url?: string }) {
        if (j.title) {
            document.getElementById(`${i}-title`).style.display = 'block';
            document.getElementById(`${i}-input-title`).setAttribute('type', 'hidden');
            this.getshopdetails.links[i].title = (<HTMLInputElement>document.getElementById(`${i}-input-title`)).value;
        }
        if (j.url) {
            document.getElementById(`${i}-url`).style.display = 'block';
            document.getElementById(`${i}-input-url`).setAttribute('type', 'hidden');
            this.getshopdetails.links[i].url = (<HTMLInputElement>document.getElementById(`${i}-input-url`)).value;
        }
        this.profileService.updateShopDetails({ links: this.getshopdetails.links }).then((data) => (this.getshopdetails = data));
        this.ngOnInit();
    }

    // deletelinks(i: number) {
    //     this.profileService.updateShopDetails({ links: this.getshopdetails.links.splice(i, 1) });
    // }

    fetchData() {
        return this.shopifyService.listShopItem().then((items) => (this.productList = items));
    }

    handleData() {
        const product_list = this.shopDetail.product_list;

        // Split product
        const shop_product_list = [];
        const remaining_product_list = [];
        this.productList.forEach((product: { sold: number; influencers: number; product_id: number }) => {
            product.sold = Math.round(Math.random() * 45 + 5);
            product.influencers = Math.round(Math.random() * 180 + 20);
            if (product_list.indexOf(this.shopifyService.encodingShopifyId(product.product_id)) >= 0) {
                shop_product_list.push(product);
            } else {
                remaining_product_list.push(product);
            }
        });

        this.shopProductList = shop_product_list.sort((a, b) => {
            return a.promoted ? -1 : 1;
        });
        this.remainingProductList = remaining_product_list.sort((a, b) => {
            return a.promoted ? -1 : 1;
        });

        this.shopifyService.getShopVisitsHistory().then((visitsHistory) => {
            let total_count = 0;
            for (let i = 0; i < visitsHistory.length; i++) {
                total_count += visitsHistory[i].visits_count;
            }
            if (total_count < 3 && !this.shopDetail.isTutorialShowed) {
                this.showStoreTutorial();
                this.profileService
                    .updateShopDetails({ isTutorialShowed: true })
                    .then((updatedDetails) => (this.shopDetail.isTutorialShowed = true));
            }
        });
    }

    updateShopDetail(shopDetail: ShopDetail) {
        this.shopDetail = shopDetail;
    }

    toggleSelectedTab(tab: 'selections' | 'links' | 'settings' | 'report' | 'my_links' | 'my_products' = 'selections') {
        this.selectedFirstTab = tab;
    }

    addProductToShop(product: { loading: boolean; product_id: number; promoted: any }, index: number) {
        if (product.loading) {
            return;
        }
        if (this.shopProductList.length >= 20) {
            this.messagesService.showMessage({
                type: MessageType.message,
                showOverlay: true,
                messageLevel: MessageLevel.error,
                text: 'You can only select up to 20 items.',
            });
            return;
        }
        product.loading = true;
        const product_list = this.shopProductList.map((result) => this.shopifyService.encodingShopifyId(result.product_id));
        product_list.push(this.shopifyService.encodingShopifyId(product.product_id));
        this.shopifyService.updateProductList(product_list).then((result) => {
            if (product.promoted) {
                this.shopProductList.splice(0, 0, product);
            } else {
                this.shopProductList.push(product);
            }
            this.shopDetail.product_list = this.shopProductList.map((product) => {
                return this.shopifyService.encodingShopifyId(product.product_id);
            });
            this.remainingProductList.splice(index, 1);
            this.messagesService.showMessage({
                type: MessageType.message,
                showOverlay: true,
                messageLevel: MessageLevel.success,
                text: 'The selected item has been added to your shop.',
            });
            product.loading = false;
        });
    }

    removeProductFromShop(product: any, index: any) {
        event.stopPropagation();
        this.removeModalShow = true;
        this.selectedProduct = product;
    }

    removeProductReal(product: { loading: boolean; product_id: number; promoted: any }) {
        if (product.loading) {
            return;
        }
        product.loading = true;
        const product_list = this.shopProductList.map((result) => this.shopifyService.encodingShopifyId(result.product_id));
        const index = product_list.indexOf(this.shopifyService.encodingShopifyId(product.product_id));
        product_list.splice(index, 1);

        this.shopifyService.updateProductList(product_list).then((result) => {
            // this.messagesService.showMessage({
            //     type: MessageType.message,
            //     showOverlay: true,
            //     messageLevel: MessageLevel.success,
            //     text: 'The selected item has been removed from your shop.',
            // });
            this.shopProductList.splice(index, 1);
            if (product.promoted) {
                this.remainingProductList.splice(0, 0, product);
            } else {
                this.remainingProductList.push(product);
            }
            this.shopDetail.product_list = this.shopDetail.product_list.filter((item) => {
                return item !== this.shopifyService.encodingShopifyId(product.product_id);
            });
            this.removeModalShow = false;
            this.selectedProduct = null;
            product.loading = false;
        });
    }

    showStoreTutorial() {
        this.modalService.create({
            nzContent: StoreTutorialComponent,
            nzClosable: false,
            nzFooter: null,
            nzCloseOnNavigation: true,
            nzBodyStyle: {
                borderRadius: '20px',
            },
        });
    }

    openPreviewPage() {
        const LINK = `${environment.shopHost}/${this.shopDetail.shop_url || this.shopDetail.shop_id}`;
        window.open(LINK, '_blank');
    }

    onRemoveModalClose() {
        this.removeModalShow = false;
    }

    videProductDetail(product: { product_id: number }) {
        this.router.navigate([
            `/internal-shop/product-detail/${this.shopDetail.shop_id}/${this.shopifyService.encodingShopifyId(product.product_id)}`,
        ]);
    }

    viewStorereport() {
        this.router.navigate(['/internal-shop/store-report']);
    }

    backToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    changeActiveTab(tab: AvailableTypes) {
        this.currentActiveTab$.next(tab);
    }
}
