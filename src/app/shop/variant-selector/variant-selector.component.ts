import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-variant-selector',
    templateUrl: './variant-selector.component.html',
    styleUrls: ['./variant-selector.component.scss'],
})
export class VariantSelectorComponent implements OnInit {
    @Input() product;

    @Output() onUpdateSelection = new EventEmitter<any>();

    selectedVariants = [];
    productOptions;

    allProductVariants;

    get variantsExist() {
        return this.productOptions?.length > 1 || this.productOptions[0]?.values?.length > 1;
    }

    constructor() {}

    ngOnInit(): void {
        this.populateProductOptions(this.product);
    }

    populateProductOptions(product) {
        this.allProductVariants = product.variants;
        const finalProductVariant = product.variants[0];
        const selectedOptionMap = {};
        finalProductVariant.selectedOptions.forEach((option) => {
            selectedOptionMap[option.name] = option.value;
        });

        const productOptions = [];
        for (const [index, option] of product.options.entries()) {
            const types = [];
            for (const type of option.values) {
                if (type.value) {
                    types.push({
                        name: type.value,
                        selected: false,
                        disabled: index !== 0,
                    });
                }
            }
            productOptions.push({
                name: option.name,
                values: types,
            });
        }
        this.productOptions = productOptions;
        for (let index = 0; index < this.productOptions.length; index++) {
            const option = this.productOptions[index];
            option.values.forEach((value) => {
                if (selectedOptionMap[option.name] === value.name) {
                    this.onVariantOptionSelected(value, index);
                }
            });
        }
    }

    findSelectedVariant() {
        const variantsArr = this.selectedVariants.map((item) => item.value);
        let finalProductVariant;
        for (let i = 0; i < this.allProductVariants.length; i++) {
            let foundMatch = true;
            const selectedOptions = this.allProductVariants[i].selectedOptions;

            for (let j = 0; j < selectedOptions.length; j++) {
                if (!variantsArr.includes(selectedOptions[j].value)) {
                    foundMatch = false;
                    break;
                }
            }
            if (foundMatch) {
                finalProductVariant = this.allProductVariants[i];
                break;
            }
        }
        return finalProductVariant;
    }

    // disable all unavailable options in a given variant row level, based on currently selected variants.
    disableUnavailableOptionsInRow(selectedVariants) {
        const selectedVariantsArr = selectedVariants.map((e) => e.value);
        const include = new Set();

        for (let i = 0; i < this.allProductVariants.length; i++) {
            const selectedOptions = this.allProductVariants[i].selectedOptions;
            let match = true;
            for (let j = 0; j < selectedOptions.length - 1; j++) {
                if (selectedOptions[j].value !== selectedVariantsArr[j]) {
                    match = false;
                }
            }
            if (match) {
                include.add(selectedOptions[selectedOptions.length - 1].value);
            }
        }

        this.productOptions[this.productOptions.length - 1].values.forEach((value) => {
            if (include.has(value.name)) {
                value.disabled = false;
            }
        });
    }

    onVariantOptionSelected(curValue, curLevel) {
        this.selectedVariants[curLevel] = {
            variantLevel: curLevel,
            key: this.productOptions[curLevel].name,
            value: curValue.name,
        };

        // Only keep currentlevel selection and upper level selection
        this.selectedVariants = this.selectedVariants.filter((item) => item.variantLevel <= curLevel);

        if (this.selectedVariants.length === this.productOptions.length) {
            this.onUpdateSelection.emit(this.findSelectedVariant());
        } else {
            this.onUpdateSelection.emit(false);
        }

        // Unselect everything below
        for (let i = curLevel; i < this.productOptions.length; i++) {
            this.productOptions[i].values.forEach((value) => {
                value.selected = false;
            });
        }

        curValue.selected = true;

        if (this.productOptions.length - curLevel === 3) {
            this.productOptions[curLevel + 1].values.forEach((value) => {
                value.disabled = false;
            });
            this.productOptions[curLevel + 2].values.forEach((value) => {
                value.disabled = true;
            });
        } else if (this.productOptions.length - curLevel === 2) {
            this.productOptions[curLevel + 1].values.forEach((value) => {
                value.disabled = true;
            });
            this.disableUnavailableOptionsInRow(this.selectedVariants);
        }
    }
}
