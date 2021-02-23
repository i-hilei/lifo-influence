import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FromToInterface, NzCarouselComponent } from 'ng-zorro-antd';
import { ToastService } from 'ng-zorro-antd-mobile';
import { AddressFormModalComponent } from './address-form-modal/address-form-modal.component';
import { PurchaseSampleModalComponent } from './purchase-sample-modal/purchase-sample-modal.component';

import { ShopifyService } from '@src/app/services/shopify.service';
import { FirebaseEventsService } from '@services/firebase-events.service';
import { ProductDetailService, SampleStatusEnum } from './product-detail.service';
import { copy } from '@shared/methods/copy';
import { ShopService } from '../shop.service';
import { environment } from '@src/environments/environment';
import { FormControl, Validators } from '@angular/forms';
import { PhoneService } from '@services/phone.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
    phonePrefix = '+1';
    get phone_number() {
        return `${this.phonePrefix}${this.phoneNumberControl.value}`;
    }
    shopId;
    internalShopId;
    productId;
    internalProductId;
    internalProduct;
    sharedCode;
    selectedIndex = 0;
    selectImgDisabled = false;
    allProductVariants;
    displayVariants;
    productOptions;

    payButtonDisabled = false;
    finalProductVariant;
    math = Math;
    date: number;

    modalControl = {
        addressInputsModal: false,
        purchaseSampleModal: false,
        variantModal: false,
    };
    sampleStatus: SampleStatusEnum;
    isAddingToSelection = false;
    isCreatingOrder = false;
    getDiscountModal = false;
    showLinkModal = false;
    likeModal = {
        show_modal: false,
        step_1: true,
        step_2: false,
    };
    shopingCart = [];
    phoneNumberControl: FormControl = new FormControl('', Validators.required);
    verificationCodeControl: FormControl = new FormControl('', Validators.required);
    productShareCodeObject: {
        id: string;
        code: string;
        likes_count: number;
    } = {
        id: undefined,
        code: undefined,
        likes_count: 0,
    };
    productLink: string;

    remainingDurationToSendCode = 0;
    intervalIds = {
        code: null,
        date: null,
    };

    gettingCode = false;

    get enableShopingCart() {
        return this.shopDetail?.enable_shoping_cart;
    }

    get disableSendCode() {
        return this.remainingDurationToSendCode > 0;
    }

    get isProductSelected() {
        const productList: string[] = this.shopDetail?.product_list;
        return productList && productList.includes(this.productId);
    }

    get isProductListFilled() {
        const productList: string[] = this.shopDetail?.product_list;
        return productList?.length >= 20;
    }

    // Cached data
    get shopDetail() {
        return this.shopService.cachedShopDetail;
    }
    set shopDetail(detail) {
        this.shopService.cachedShopDetail = detail;
    }

    get product() {
        return this.shopService.getCachedProdcutDetailById(this.productId);
    }
    set product(detail) {
        this.shopService.setProductDetailToCache(this.productId, detail);
    }

    get productList() {
        return this.shopService.cachedProductList;
    }
    set productList(list) {
        this.shopService.cachedProductList = list;
    }

    get shoppingCartItems() {
        let count = 0;
        this.shopingCart.forEach(item => {
            count += item.count;
        });
        return count;
    }

    get getCurrentLikeStatus() {
        const friends = this.productShareCodeObject.likes_count === 1 ? '1 friend' : `${this.productShareCodeObject.likes_count} friends`;
        const discount = Math.min(90, this.productShareCodeObject.likes_count * 10);
        return `${friends} LIKED you now: extra ${discount}% off earned.`;
    }

    get discountPercentage() {
        return Math.min(90, this.productShareCodeObject.likes_count * 10);
    }

    @ViewChild('carousel') carousel: NzCarouselComponent;
    @ViewChild('AddressFormModal') AddressFormModal: AddressFormModalComponent;
    @ViewChild('PurchaseSampleModal') PurchaseSampleModal: PurchaseSampleModalComponent;

    constructor(
        private shopifyService: ShopifyService,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private toast: ToastService,
        private firebaseEventsService: FirebaseEventsService,
        private productDetailService: ProductDetailService,
        private router: Router,
        private shopService: ShopService,
        private phoneService: PhoneService
    ) {
        this.shopId = this.activatedRoute.snapshot.paramMap.get('shopId');
        this.internalShopId = this.activatedRoute.snapshot.paramMap.get('internalShopId');
        this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
        this.internalProductId = atob(this.productId).replace('gid://shopify/Product/', '');
        this.sharedCode = this.activatedRoute.snapshot.paramMap.get('sharedCode');

        this.intervalIds.date = setInterval(() => {
            this.date = Math.round(new Date().getTime() / 1000);
        }, 1000);
    }

    async ngOnInit() {
        const phoneNumber = localStorage.getItem('client_phone_number');
        if (phoneNumber) {
            this.phoneNumberControl.patchValue(phoneNumber);
            const productShareCodeObject = await this.productDetailService.checkProductLink(this.shopId, this.productId, phoneNumber);
            if (productShareCodeObject && !productShareCodeObject.error) {
                this.productShareCodeObject = productShareCodeObject;
                this.productLink = `${environment.shopHost}/product-detail/${this.shopId}/${encodeURIComponent(this.productId)}/${
                    this.productShareCodeObject.code
                }`;
            }
        }

        if (this.shopId) {
            this.firebaseEventsService.logEvent({
                name: 'product_detail_view',
                properties: {
                    shop_id: this.shopId,
                    product_id: this.productId,
                },
            });
            this.shopifyService.getShopDetailExternal(this.shopId).then((detail) => {
                this.shopDetail = detail;
                this.shopingCart = this.shopifyService.shopingCart;
            });
        } else {
            this.getSampleStatus();
        }

        if (!this.product || !this.productList) {
            this.fetchProductDetailAndList();
        } else {
            this.handleProductDetailAndList();
        }
    }

    @HostListener('window:popstate')
    async ngOnDestroy() {
        this.isCreatingOrder = false;
        Object.values(this.intervalIds).forEach((id) => clearInterval(id));
    }

    fetchProductDetailAndList() {
        Promise.all([
            this.shopifyService.fetchProductById(this.productId),
            this.shopifyService.listShopItem(),
            this.productDetailService.getProductById(this.internalProductId),
        ])
            .then((result) => {
                const [product, items, internalProductObject] = result;
                this.internalProduct = internalProductObject;
                this.product = product;
                this.productList = items;
                this.handleProductDetailAndList();
            })
            .then(() => {
                if (this.sharedCode && !this.likeModal.show_modal && this.sharedCode !== this.productShareCodeObject.code) {
                    this.likeModal.show_modal = true;
                }
            });
    }

    handleProductDetailAndList() {
        this.product.sold = Math.round(Math.random() * 45 + 5);
        this.product.influencers = Math.round(Math.random() * 180 + 20);
        this.finalProductVariant = this.product.variants[0];

        this.productList.forEach((item) => {
            if (item.product_id === this.shopifyService.getShopifyIdFromBase64(this.product.id)) {
                this.product.commission = item.commission;
                this.product.additional_commission = item.additional_commission ? item.additional_commission : 0;
                this.product.commission_offer_deadline = item.commission_offer_deadline;
                this.product.discount_deadline = item.discount_deadline;
                this.product.promoted = item.promoted;
            }
        });
    }

    updateSelectVariant(selectedVariant) {
        if (selectedVariant) {
            this.finalProductVariant = selectedVariant;
            this.payButtonDisabled = false;
        } else {
            this.payButtonDisabled = true;
        }
    }

    async createOrder(value) {
        const { quantity } = value;
        this.modalControl.variantModal = false;
        this.firebaseEventsService.logEvent({
            name: 'click_buy_product_button',
            properties: {
                shop_id: this.shopId,
                product_id: this.productId,
            },
        });

        this.isCreatingOrder = true;
        let commission = this.product.commission;
        if (this.shopDetail.active_bonuses && this.shopDetail.active_bonuses.commission) {
            commission += (this.product.commission * this.shopDetail.active_bonuses.commission) / 100;
        }

        let couponCodeObject: { code: string } = { code: null };

        if (this.productShareCodeObject.id && this.productShareCodeObject.likes_count > 0) {
            couponCodeObject = await this.shopifyService.generateCouponCode(this.productShareCodeObject.id, this.phone_number);
        }

        const result = await this.shopifyService.createCheckout({
            product_variant: this.finalProductVariant,
            shop_id: this.shopDetail.id,
            commission,
            coupon_code: couponCodeObject.code,
            quantity,
        });
        window.location.assign(result);
    }

    addToCart(value) {
        const { quantity } = value;
        this.modalControl.variantModal = false;

        this.shopingCart = this.shopifyService.addItemToShopingCart(this.product.id, this.finalProductVariant.id, quantity);
    }

    selectPreviewImg(index: number) {
        if (this.selectImgDisabled) {
            return;
        }
        this.selectedIndex = index;
        this.carousel.goTo(this.selectedIndex);
    }

    beforeChange(fromTo: FromToInterface) {
        this.selectImgDisabled = true;
        this.selectedIndex = fromTo.to;
    }

    afterChange() {
        this.selectImgDisabled = false;
    }

    backToDashboard() {
        this.location.back();
    }

    copyLink() {
        const encodedId = encodeURIComponent(this.productId);
        const URL = `${environment.shopHost}/product-detail/${this.internalShopId || this.shopId}/${encodedId}`;
        if (copy(URL)) {
            this.toast.info('Product URL has been copied into the clipboard! Paste it to your friends', 3000, null, false, 'top');
        } else {
            this.toast.fail('Copy failed!', 2000, null, false, 'top');
        }
    }

    visitCart() {
        this.router.navigate([`/shoping-cart/${this.shopId}`]);
    }

    getSampleStatus() {
        this.productDetailService
            .getSampleStatus({
                shopId: this.internalShopId,
                productId: this.shopifyService.getShopifyIdFromBase64(this.productId),
            })
            .then((res) => (this.sampleStatus = res.status))
            .catch((err) => {});
    }

    addToSelection() {
        this.isAddingToSelection = true;
        const product_list = [...this.shopDetail.product_list, this.productId];
        this.shopifyService
            .updateProductList(product_list)
            .then((result) => {
                this.shopDetail.product_list = result.product_list;
            })
            .catch((err) => {})
            .finally(() => (this.isAddingToSelection = false));
    }

    purchaseSample(influencer) {
        this.AddressFormModal.isPurchasing = true;
        this.productDetailService
            .orderSample({
                shop_id: this.internalShopId,
                product_id: this.shopifyService.getShopifyIdFromBase64(this.productId),
                price: 1,
                shipping_address: influencer,
            })
            .then((res) => (this.sampleStatus = SampleStatusEnum.ordered))
            .catch((err) => {})
            .finally(() => {
                this.AddressFormModal.isPurchasing = false;
                this.modalControl.addressInputsModal = false;
            });
    }

    // Modal state control
    confirmPurchaseClick() {
        this.modalControl.purchaseSampleModal = false;
        this.modalControl.addressInputsModal = true;
    }

    showPurchaseSampleModal() {
        this.modalControl.purchaseSampleModal = true;
    }

    showShippingAddressForm() {
        this.modalControl.addressInputsModal = true;
    }

    showModal(modalName: 'variantModal') {
        this.modalControl[modalName] = true;
    }

    async submitPhoneNumber() {
        if (!(await this.verifyPhoneNumber())) {
            return;
        }
        await this.generateShareLink();
    }

    async verifyPhoneNumber() {
        const verificationResult = await this.phoneService.getValidateCode(this.phone_number, this.verificationCodeControl.value);
        if (verificationResult.error) {
            this.toast.fail(verificationResult.error.charAt(0).toUpperCase() + verificationResult.error.slice(1));
            return false;
        }
        return true;
    }

    async generateShareLink() {
        localStorage.setItem('client_phone_number', this.phoneNumberControl.value);
        this.productShareCodeObject = await this.productDetailService.getProductShareLink(
            this.shopId,
            this.productId,
            this.phoneNumberControl.value
        );
        this.showLinkModal = true;
        this.productLink = `${environment.shopHost}/product-detail/${this.shopId}/${encodeURIComponent(this.productId)}/${
            this.productShareCodeObject.code
        }`;
        this.copyProductLinkToClipboard();
    }

    async likeProduct() {
        if (!(await this.verifyPhoneNumber())) {
            return;
        }
        const like_result = await this.productDetailService.getLikeProduct(this.sharedCode, this.phoneNumberControl.value);
        if (like_result.error) {
            this.toast.fail('Please use a different phone number.');
            return;
        }
        // await this.generateShareLink();
        this.likeModal.show_modal = false;
    }

    copyProductLinkToClipboard(showMessage: boolean = false) {
        if (!this.productLink) {
            return;
        }

        copy(this.productLink);
        if (showMessage) {
            this.toast.success('Link has been copied into the clipboard!', 3000, null, false, 'center');
        }
    }

    getCode() {
        this.gettingCode = true;
        this.phoneService
            .getVerificationCode(this.phone_number)
            .then(() => {
                this.remainingDurationToSendCode = 59;
                this.intervalIds.code = setInterval(() => {
                    if (this.remainingDurationToSendCode === 0) {
                        clearInterval(this.intervalIds.code);
                        return;
                    }

                    this.remainingDurationToSendCode--;
                }, 1000);
            })
            .catch(() => this.toast.fail('Invalid phone number!', 2000, null, false, 'middle'))
            .finally(() => (this.gettingCode = false));
    }
}
