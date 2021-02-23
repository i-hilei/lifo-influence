import { AfterContentChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopifyService } from '@src/app/services/shopify.service';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FirebaseEventsService } from '@services/firebase-events.service';
import { ShopService } from '../shop.service';
import { environment } from '@src/environments/environment';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['../select-product/select-product.component.scss', './product-list.component.scss'],
})
export class ProductListComponent implements OnInit, AfterContentChecked, OnDestroy {
    @ViewChildren('shopItem') shopItems: ElementRef[] = [];
    lifoProductList = [];
    shopProductList = [];

    viewedProductIds: string[] = [];
    productToEvents: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    loading = true;
    shopId;

    modalControl = {
        selectVariantModel: false,
    };
    selectProductDetail;
    selectProduct;
    selectProductVariant;
    payButtonDisabled = false;

    isCreatingOrder = false;
    enableShopingCart = false;
    shopingCart = [];
    getshopdetails: any;
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

    get shoppingCartItems() {
        let count = 0;
        this.shopingCart.forEach((item) => {
            count += item.count;
        });
        return count;
    }

    constructor(
        private shopifyService: ShopifyService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private firebaseEventsService: FirebaseEventsService,
        private shopService: ShopService
    ) {
        this.shopId = this.activatedRoute.snapshot.paramMap.get('shopId');
    }

    async ngOnInit() {
        this.shopifyService.getShopDetailInternal().then((data) => {
            this.getshopdetails = data;
        });
        await this.fetchData()
            .then(() => {
                this.loading = false;
                this.handleData();
            })
            .catch(() => (window.location.href = `${environment.host}/get-started`));

        this.productToEvents.pipe(filter((productId) => !!productId)).subscribe((productId) => {
            if (!this.viewedProductIds.includes(productId)) {
                this.firebaseEventsService.logEvent({
                    name: 'product_viewed',
                    properties: {
                        shop_id: this.shopDetail.shop_id,
                        product_id: productId,
                    },
                });
                this.viewedProductIds.push(productId);
            }
        });
    }

    @HostListener('window:popstate')
    async ngOnDestroy() {
        this.isCreatingOrder = false;
    }

    fetchData() {
        return Promise.all([this.shopifyService.getShopDetailExternal(this.shopId), this.shopifyService.listShopItem()]).then(
            ([shop, items]) => {
                // Catch data
                this.shopService.cachedShopDetail = shop;
                this.shopService.cachedProductList = items;
            }
        );
    }

    handleData() {
        const product_list = this.shopDetail.product_list;
        this.enableShopingCart = !!this.shopDetail.enable_shoping_cart;
        this.shopingCart = this.shopifyService.shopingCart;

        this.firebaseEventsService.logEvent({
            name: 'shop_page_view',
            properties: {
                shop_id: this.shopDetail.shop_id,
            },
        });

        // Split product
        const shop_product_list = [];
        const lifo_product_list = [];
        this.productList.forEach((product) => {
            if (product_list.indexOf(this.shopifyService.encodingShopifyId(product.product_id)) >= 0) {
                shop_product_list.push(product);
            } else {
                lifo_product_list.push(product);
            }
        });

        this.shopProductList = shop_product_list.sort((a, b) => {
            return a.promoted ? -1 : 1;
        });
        this.lifoProductList = lifo_product_list.sort((a, b) => {
            return a.promoted ? -1 : 1;
        });
    }

    displayTitle(title, max_length = 70) {
        if (title.length > max_length) {
            return `${title.substring(0, max_length - 3)}...`;
        }
        return title;
    }

    async createOrder(product) {
        event.stopPropagation();
        this.selectProductDetail = null;
        this.selectProduct = null;
        this.selectProductVariant = null;
        const productDetail = await this.shopifyService.fetchProductById(this.shopifyService.encodingShopifyId(product.product_id));

        // show popup
        this.modalControl.selectVariantModel = true;
        this.selectProductDetail = productDetail;
        this.selectProduct = product;
    }

    updateSelectVariant(selectedVariant) {
        if (selectedVariant) {
            setTimeout(() => {
                this.selectProductVariant = selectedVariant;
            }, 200);
            this.payButtonDisabled = false;
        } else {
            this.payButtonDisabled = true;
        }
    }

    realCheckout({ quantity }) {
        this.firebaseEventsService.logEvent({
            name: 'click_buy_product_button',
            properties: {
                shop_id: this.shopDetail.shop_id,
                product_id: this.selectProduct.product_id,
            },
        });

        this.modalControl.selectVariantModel = false;

        this.isCreatingOrder = true;
        this.shopifyService
            .createCheckout({
                product_variant: this.selectProductVariant,
                shop_id: this.shopDetail.id,
                commission: this.selectProduct.commission,
                quantity,
            })
            .then((result) => {
                window.location.assign(result);
            });
    }

    addToCart({ quantity }) {
        this.shopingCart = this.shopifyService.addItemToShopingCart(this.selectProductDetail.id, this.selectProductVariant.id, quantity);
        this.modalControl.selectVariantModel = false;
    }

    videProductDetail(product) {
        if (environment.shopHost.endsWith('shop')) {
            this.router.navigate([
                `/shop/product-detail/${this.shopDetail.shop_url || this.shopDetail.shop_id}/` +
                    `${this.shopifyService.encodingShopifyId(product.product_id)}`,
            ]);
        } else {
            this.router.navigate([
                `/product-detail/${this.shopDetail.shop_url || this.shopDetail.shop_id}/` +
                    `${this.shopifyService.encodingShopifyId(product.product_id)}`,
            ]);
        }
    }

    visitCart() {
        this.router.navigate([`/shoping-cart/${this.shopDetail.shop_id}`]);
    }

    joinLifo() {
        window.location.href = `${environment.host}/sign-up?source=shop`;
    }

    ngAfterContentChecked() {
        this.shopItems.forEach((elem) => {
            this.isElementInViewport(elem);
        });
    }

    isElementInViewport(el) {
        const rect = el.nativeElement.getBoundingClientRect();
        const isInViewport =
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth); /* or $(window).width() */

        if (isInViewport) {
            this.productToEvents.next(el.nativeElement.attributes.product_id.value);
        }
        return isInViewport;
    }

    @HostListener('window:scroll', ['$event']) // for window scroll events
    onScroll() {
        this.shopItems.forEach((elem) => {
            this.isElementInViewport(elem);
        });
    }
}
