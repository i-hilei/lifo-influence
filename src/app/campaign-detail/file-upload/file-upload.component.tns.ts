import { LocalFile } from '@shared/components/only-native-component/media-preview/media-preview.component.tns';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Mediafilepicker, ImagePickerOptions, VideoPickerOptions } from 'nativescript-mediafilepicker';
import { Application, File, AlertOptions, alert } from '@nativescript/core';
import { ActivatedRoute } from '@angular/router';
import { registerElement, RouterExtensions } from '@nativescript/angular';
import { ICampaignDetail } from '@src/app/typings/campaign';
import { Video } from 'nativescript-videoplayer';
import { CampaignDetailService } from '@src/app/campaign-detail/campaign-detail.service';
import { CampaignsService } from '@src/app/services/campaigns.service';
import { ProfileService } from '@src/app/services/profile.service';
import { storage } from '@nativescript/firebase/storage';
registerElement('VideoPlayer', () => Video);

declare const AVCaptureSessionPreset1920x1080;
declare const AVCaptureSessionPresetHigh;

export interface UploadedFile {
    file: string;
    path: string;
    type: 'image' | 'video';
}

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.tns.html',
    styleUrls: ['./file-upload.component.tns.scss'],
})
export class FileUploadComponent {
    MAX_IMG_NUMBER = 6;
    MAX_VIDEO_NUMBER = 1;

    campaignDetail: ICampaignDetail;
    influencerCampaignId: string;
    brandCampaignId: string;

    uploadedImgs: LocalFile[] = [];
    uploadedVideos: LocalFile[] = [];
    toBeUploadImgs: LocalFile[] = [];
    toBeUploadVideos: LocalFile[] = [];
    currentUploadedFiles: LocalFile[] = [];
    fileProgressMap: { [key: string]: number } = {};

    isUploading = false;

    get enableImgAddBtn() {
        return this.campaignDetail && this.MAX_IMG_NUMBER - this.imgs.length > 0;
    }

    get enableVideoAddBtn() {
        return this.campaignDetail && this.MAX_VIDEO_NUMBER - this.videos.length > 0;
    }

    get imgs() {
        return this.uploadedImgs.concat(this.toBeUploadImgs);
    }

    get videos() {
        return this.uploadedVideos.concat(this.toBeUploadVideos);
    }

    get enableSubmitBtn() {
        return [...this.imgs, ...this.videos].length > 0 && !this.isUploading;
    }

    caption: string = '';

    constructor(
        private cdr: ChangeDetectorRef,
        private router: RouterExtensions,
        private activatedRoute: ActivatedRoute,
        private campaignDetailService: CampaignDetailService,
        private campaignsService: CampaignsService,
        private profileService: ProfileService
    ) {}

    async ngOnInit() {
        this.initValue();
        await this.getCampaignDetail();
        this.setDefaultValue();
    }

    async initValue() {
        this.brandCampaignId = this.activatedRoute.snapshot.paramMap.get('brandCampaignId');
        this.influencerCampaignId = this.activatedRoute.snapshot.paramMap.get('campaignId');
    }

    async getCampaignDetail() {
        const historyList = await (await this.campaignDetailService.getCampaignById(this.influencerCampaignId)).toPromise();
        this.campaignDetail = historyList?.history_list[0];
    }

    setDefaultValue() {
        if (this.campaignDetail?.content) {
            this.uploadedImgs = this.campaignDetail?.content?.images.map((img) => {
                return { file: img.url, type: 'image', path: img.path };
            });
            this.uploadedVideos = this.campaignDetail?.content?.videos.map((video) => {
                return { file: video.url, type: 'video', path: video.path };
            });
        }
        this.caption = this.campaignDetail?.description;
    }

    openImgs() {
        const mediafilePicker: Mediafilepicker = new Mediafilepicker();
        const options: ImagePickerOptions = {
            android: {
                isCaptureMood: false, // if true then camera will open directly.
                isNeedCamera: true,
                maxNumberFiles: this.MAX_IMG_NUMBER - this.uploadedImgs.length,
                isNeedFolderList: true,
            },
            ios: {
                isCaptureMood: false, // if true then camera will open directly.
                isNeedCamera: true,
                maxNumberFiles: this.MAX_IMG_NUMBER - this.uploadedImgs.length,
            },
        };
        mediafilePicker.openImagePicker(options);
        mediafilePicker.on('getFiles', (res) => {
            const results = res.object.get('results');
            this.toBeUploadImgs = results;
            this.cdr.detectChanges();
        });
    }

    openVideos() {
        let allowedVideoQualities = [];

        if (Application.ios) {
            allowedVideoQualities = [AVCaptureSessionPreset1920x1080, AVCaptureSessionPresetHigh];
            // get more from here: https://developer.apple.com/documentation/avfoundation/avcapturesessionpreset?language=objc
        }

        const options: VideoPickerOptions = {
            android: {
                isCaptureMood: false, // if true then camera will open directly.
                isNeedCamera: false,
                maxNumberFiles: this.MAX_VIDEO_NUMBER - this.uploadedVideos.length,
            },
            ios: {
                maxNumberFiles: this.MAX_VIDEO_NUMBER - this.uploadedVideos.length,
                isCaptureMood: false, // if true then camera will open directly.
            },
        };

        const mediafilepicker = new Mediafilepicker();
        mediafilepicker.openVideoPicker(options);

        mediafilepicker.on('getFiles', (res) => {
            const results = res.object.get('results');
            this.toBeUploadVideos = results;
            this.cdr.detectChanges();
        });
    }

    removeImg(img: LocalFile) {
        const uploadedIndex = this.uploadedImgs.findIndex((f) => f === img);
        const tobeUploadIndex = this.toBeUploadImgs.findIndex((f) => f === img);
        if (uploadedIndex !== -1) {
            this.uploadedImgs.splice(uploadedIndex, 1);
        }
        if (tobeUploadIndex !== -1) {
            this.toBeUploadImgs.splice(tobeUploadIndex, 1);
        }
    }

    removeVideo(video: LocalFile) {
        const uploadedIndex = this.uploadedVideos.findIndex((f) => f === video);
        const tobeUploadIndex = this.toBeUploadVideos.findIndex((f) => f === video);
        if (uploadedIndex !== -1) {
            this.uploadedVideos.splice(uploadedIndex, 1);
        }
        if (tobeUploadIndex !== -1) {
            this.toBeUploadVideos.splice(tobeUploadIndex, 1);
        }
    }

    submitContent() {
        if (!this.enableSubmitBtn) return;

        this.isUploading = true;
        [...this.uploadedImgs, ...this.uploadedVideos].forEach((file) => {
            this.fileProgressMap[file.file] = 100;
        });
        const newUploadFiles = [...this.toBeUploadImgs, ...this.toBeUploadVideos];
        if (newUploadFiles.length === 0) {
            this.updateCampaign();
        } else {
            const promiseArr: Promise<any>[] = [];
            newUploadFiles.forEach((file) => {
                promiseArr.push(this.uploadFile(file));
            });
            Promise.all(promiseArr)
                .then((res) => {
                    console.log(res);
                    this.updateCampaign();
                })
                .catch((err) => {
                    this.isUploading = false;
                    const msg = 'Upload file failed, please try again';
                    this.showErrorAlert(msg);
                });
        }
    }

    uploadFile(file: LocalFile) {
        const url = file.file;
        const realFile = File.fromPath(url);
        const metadata = {};
        const path = `/content/${this.influencerCampaignId}/${Date.now()}`;
        return storage
            .uploadFile({
                metadata,
                localFile: realFile,
                remoteFullPath: path,
                onProgress: (status) => {
                    this.fileProgressMap[url] = Number(status.percentageCompleted);
                    this.cdr.detectChanges();
                },
            })
            .then(async (res) => {
                const downloadUrl = await storage.getDownloadUrl({ remoteFullPath: path });
                this.currentUploadedFiles.push({ file: downloadUrl, type: file.type, path });
                return Promise.resolve(res);
            });
    }

    async updateCampaign() {
        console.log('updataCampaign');
        const images = [...this.currentUploadedFiles, ...this.uploadedImgs]
            .filter((file) => file.type === 'image')
            .map((file) => {
                return { url: file.file, path: file.path };
            });
        const videos = [...this.currentUploadedFiles, ...this.uploadedVideos]
            .filter((file) => file.type === 'video')
            .map((file) => {
                return { url: file.file, path: file.path };
            });
        const content = { images, videos };

        const updateCampaignResponse = await this.campaignDetailService.updateCampaign(
            this.influencerCampaignId,
            this.campaignDetail,
            content,
            this.caption
        );
        updateCampaignResponse.subscribe(
            () => {
                this.campaignsService
                    .submitContent(this.brandCampaignId)
                    .then((result) => {
                        console.log(result);
                        this.router.navigate([`campaign-detail/campaign-review/${this.brandCampaignId}/${this.influencerCampaignId}`], {
                            skipLocationChange: true,
                        });
                    })
                    .catch((err) => this.showErrorAlert())
                    .finally(() => {});
            },
            () => {}
        );
    }

    showErrorAlert(message: string = 'Error. Please try again later.') {
        const options: AlertOptions = {
            message,
            okButtonText: 'Ok',
        };
        alert(options);
    }
}
