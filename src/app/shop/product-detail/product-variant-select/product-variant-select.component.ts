import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ShopService } from '@src/app/shop/shop.service';

@Component({
    selector: 'app-product-variant-select',
    templateUrl: './product-variant-select.component.html',
    styleUrls: ['./product-variant-select.component.scss'],
})
export class ProductVariantSelectComponent implements OnInit {
    quantity = 1;
    selectedVariant: any;

    get shopDetail() {
        return this.shopService.cachedShopDetail;
    }

    get discountPrice() {
        return this.selectedVariant?.price * this.quantity * (1 - this.discountPercentage / 100);
    }

    @Input() product: any;
    @Input() showCountButton: boolean = true;
    @Input() discountPercentage: number = 0; // 0 - 90

    @Output() payMoney = new EventEmitter<{ quantity: number }>();
    @Output() addToCart = new EventEmitter<{ quantity: number }>();
    @Output() updateSelectedVariants = new EventEmitter<{ quantity: number }>();

    constructor(private cdr: ChangeDetectorRef, private shopService: ShopService) {}

    ngOnInit(): void {}

    resetValues() {
        this.quantity = 1;
    }

    updateSelectVariant(variant) {
        this.selectedVariant = variant;
        this.updateSelectedVariants.emit(this.selectedVariant);
        this.cdr.detectChanges();
    }

    handleQuantity(operation: 'add' | 'reduce') {
        if (operation === 'add') {
            this.quantity++;
        }

        if (operation === 'reduce') {
            this.quantity--;
        }
    }

    pay() {
        this.payMoney.emit({ quantity: this.quantity });
    }

    addToCartHandle() {
        this.addToCart.emit({ quantity: this.quantity });
        this.resetValues();
    }

    checkQuantity() {
        if (!Number(this.quantity)) {
            this.quantity = 1;
        }
    }
}
