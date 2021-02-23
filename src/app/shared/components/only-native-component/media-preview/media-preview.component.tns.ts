import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Screen } from '@nativescript/core/platform';

export interface LocalFile {
    type: 'video' | 'image';
    file: string; // Exactly url
    fileName?: string;
    rawData?: any;
    path?: string;
}

@Component({
    selector: 'app-media-preview',
    templateUrl: './media-preview.component.tns.html',
    styleUrls: ['./media-preview.component.tns.scss'],
})
export class MediaPreviewComponent implements OnInit {
    @Input() columnFormat = 'auto,auto,auto,auto';
    @Input() rowFormat = 'auto,auto,auto';
    @Input() files: LocalFile[];
    @Input() styleConfig = {
        SCREEN_WIDTH: Screen.mainScreen.widthDIPs,
        ITEM_MARGIN: 2,
        SINGLE_PAGE_PADDING: 20,
        COUNT_OF_ITEM_EVERY_ROW: 4,
    };
    @Input() enableAddBtn = false;
    @Input() isUploading = false;
    @Input() fileProgressMap: { [key: string]: number } = {};
    @Output() onRemoveFile = new EventEmitter<LocalFile>();
    @Output() onAddFile = new EventEmitter();

    get itemSize() {
        const margin = this.styleConfig.ITEM_MARGIN * this.styleConfig.COUNT_OF_ITEM_EVERY_ROW;
        const screenWidth = this.styleConfig.SCREEN_WIDTH;
        const singlePagePadding = this.styleConfig.SINGLE_PAGE_PADDING;
        const countEveryRow = this.styleConfig.COUNT_OF_ITEM_EVERY_ROW;
        return (screenWidth - margin - singlePagePadding * 2) / countEveryRow;
    }

    constructor() {}

    ngOnInit(): void {}

    getCol(index: number) {
        return index % 4;
    }

    getRow(index: number) {
        return Math.floor(index / 4);
    }

    addFile() {
        this.onAddFile.emit();
    }

    removeFile(file: LocalFile) {
        this.onRemoveFile.emit(file);
    }
}
