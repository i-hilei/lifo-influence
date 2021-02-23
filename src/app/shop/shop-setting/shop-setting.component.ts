import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ProfileService } from '@services/profile.service';
import { FormControl, Validators } from '@angular/forms';
import { ToastService } from 'ng-zorro-antd-mobile';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FilePickerComponent } from '@shared/components/file-picker/file-picker.component';
import { ShopDetail } from '@src/app/shop/shop.type';
import { environment } from '@src/environments/environment';

export interface FilesUploadMetadata {
    uploadProgress$: Observable<number>;
    downloadUrl$: Observable<string>;
}

@Component({
    selector: 'app-shop-setting',
    templateUrl: './shop-setting.component.html',
    styleUrls: ['./shop-setting.component.scss'],
})
export class ShopSettingComponent implements OnInit {
    nameControl = new FormControl('', [Validators.required, Validators.maxLength(30)]);
    urlControl = new FormControl('', [Validators.required, Validators.pattern(/^\w+$/), Validators.maxLength(30)]);
    uploadPath = '/shops-images/';
    fileProgressMap = new Map<File, number>();

    environment = environment;

    duplicateUrl = false;
    duplicateName = false;

    customizationModal = {
        display: false,
        views: {
            name: false,
            url: false,
        },
    };
    imageUploadConfig = {
        files: [],
        accept: 'image/*',
        multiple: false,
        privateSelectable: true,
        maxSingleFileSize: null,
        maxFileCount: 1,
        get selectable() {
            return this.files.length < this.maxFileCount;
        },
    };

    get urlPlaceholder() {
        return this.shopDetail.shop_name.toLowerCase().replace(' ', '_').replace(/\W/g, '');
    }

    @Input() shopDetail: ShopDetail;
    @Output() onUpdateShopDetail = new EventEmitter<ShopDetail>();
    @ViewChild('imgFilePicker') imgFilePicker: FilePickerComponent;

    constructor(private profileService: ProfileService, private toastService: ToastService, private storage: AngularFireStorage) {}

    ngOnChanges() {
        if (this.shopDetail) {
            this.nameControl.patchValue(this.shopDetail.shop_name);
            this.urlControl.patchValue(this.shopDetail.shop_url);
        }
    }

    ngOnInit(): void {}

    uploadImg() {
        if (this.imgFilePicker) {
            this.imgFilePicker.clickAdd();
        }
    }

    // File selected
    fileChange(files: File[], type: 'image') {
        const config = this.imageUploadConfig;

        this.closeModal();

        this.toastService.loading('Uploading Image', 0);

        // Judge if the size of some files more than maxSingleFileSize
        if (config?.maxSingleFileSize) {
            const isSomeFileTooBig = files.some(
                // In computer, 1mb = 1000kb, so I use file.size / 1000 here
                (file) => file.size / 1000 > config.maxSingleFileSize
            );
            if (isSomeFileTooBig) {
                const message = `${type} too big`;
                this.showFailMessage(message);
                return;
            }
        }

        // Judge if file count more than maxFileCount
        if (config?.maxFileCount) {
            const existedFileCount = config.files.length + files.length;
            if (existedFileCount > config.maxFileCount) {
                const message = `Uploaded ${type}s should be no more than ${config.maxFileCount}`;
                this.showFailMessage(message);
                return;
            }
        }
        const { downloadUrl$, uploadProgress$ } = this.uploadFileAndGetMetadata(Array.from(files)[0]);

        uploadProgress$.subscribe((res) => {
            // console.log(res);
        });

        downloadUrl$
            .toPromise()
            .then((res) => this.profileService.updateShopDetails({ shop_image_url: res }))
            .then((res) => {
                this.onUpdateShopDetail.emit(res);
                this.toastService.hide();
            });
    }

    uploadFileAndGetMetadata(fileToUpload: File): FilesUploadMetadata {
        const { name } = fileToUpload;
        const indexOfDot = name.lastIndexOf('.');
        const fileType = name.slice(indexOfDot);
        const path = `${this.uploadPath}${this.shopDetail.shop_id}/${Date.now()}/${indexOfDot === -1 ? '' : fileType}`;
        const uploadTask: AngularFireUploadTask = this.storage.upload(path, fileToUpload);
        return {
            uploadProgress$: uploadTask.percentageChanges(),
            downloadUrl$: this.getDownloadUrl$(uploadTask, path),
        };
    }

    save(controlName: 'nameControl' | 'urlControl') {
        this.duplicateUrl = false;
        this.duplicateName = false;
        const objToUpdate: {
            shop_name?: string;
            shop_url?: string;
        } = {};
        let viewName;
        switch (controlName) {
            case 'nameControl':
                objToUpdate.shop_name = this.nameControl.value;
                viewName = 'name';
                break;
            case 'urlControl':
                objToUpdate.shop_url = this.urlControl.value;
                viewName = 'url';
                break;
            default:
                throw new Error('Unexpected control name!');
        }
        this.profileService.updateShopDetails(objToUpdate).then((updatedDetails) => {
            if (updatedDetails.error && objToUpdate.shop_url) {
                this.duplicateUrl = true;
            } else if (updatedDetails.error && objToUpdate.shop_name) {
                this.duplicateName = true;
            } else {
                this.onUpdateShopDetail.emit(updatedDetails);
                this.closeModal();
            }
        });
    }

    updateCampaignPost(status: boolean) {
        const objToUpdate = {
            show_campaign_post: status,
        };
        this.profileService.updateShopDetails(objToUpdate).then((updatedDetails) => this.onUpdateShopDetail.emit(updatedDetails));
    }

    updateShoppingCart(status: boolean) {
        const objToUpdate = {
            enable_shoping_cart: status,
        };
        this.profileService.updateShopDetails(objToUpdate).then((updatedDetails) => this.onUpdateShopDetail.emit(updatedDetails));
    }

    private getDownloadUrl$(uploadTask: AngularFireUploadTask, path: string): Observable<string> {
        return from(uploadTask).pipe(switchMap((_) => this.storage.ref(path).getDownloadURL()));
    }

    showFailMessage(message: string) {
        this.toastService.fail(message, 2000, null, false, 'middle');
    }

    showNameModal() {
        this.customizationModal.display = true;
        this.customizationModal.views.name = true;
    }

    showUrlModal() {
        this.customizationModal.display = true;
        this.customizationModal.views.url = true;
    }

    closeModal() {
        this.customizationModal.display = false;
        this.customizationModal.views.url = false;
        this.customizationModal.views.name = false;
    }
}
