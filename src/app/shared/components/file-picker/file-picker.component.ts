import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UploadedFile } from '@src/app/campaign-detail/file-upload/file-upload.component';

@Component({
    selector: 'app-file-picker',
    templateUrl: './file-picker.component.html',
    styleUrls: ['./file-picker.component.scss'],
})
export class FilePickerComponent implements OnInit {
    showProgressBar = false;
    @Input() type: 'preview' | 'button' = 'preview';
    @Input() buttonLabel: string = '';
    @Input() fileProgressMap = new Map<File, number>();
    @Input() files: (File | UploadedFile)[];
    @Input() selectable: boolean;
    @Input() multiple: boolean;
    @Input() accept: string;

    @Output() onFileChange: EventEmitter<File[]> = new EventEmitter<File[]>();
    @Output() onFileRemove: EventEmitter<File | UploadedFile> = new EventEmitter<File | UploadedFile>();

    constructor(private el: ElementRef) {}

    ngOnInit(): void {}

    clickAdd() {
        this.el.nativeElement.querySelector('.file-input').click();
    }

    fileChange(event) {
        const files: File[] = Array.from(event.target.files);
        event.target.value = null;
        this.onFileChange.emit(files);
    }

    removeFile(file: File | UploadedFile) {
        this.onFileRemove.emit(file);
    }

    isFileType(file: File | UploadedFile) {
        return file instanceof File;
    }

    startUpload() {
        this.showProgressBar = true;
    }
}
