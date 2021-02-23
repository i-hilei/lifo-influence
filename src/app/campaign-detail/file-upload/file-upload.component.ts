import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Subscription } from 'rxjs';

import { ICampaignDetail } from '@src/app/typings/campaign';
import { HeaderConfig } from '@src/app/shared/components/page-header/page-header.component';

import { ToastService } from 'ng-zorro-antd-mobile';
import { CampaignDetailService } from '@src/app/campaign-detail/campaign-detail.service';
import { CampaignsService } from '@src/app/services/campaigns.service';
import { FilePickerComponent } from '../../shared/components/file-picker/file-picker.component';
import { random } from 'lodash';
import { CampaignService } from '@services/campaign.service';

export interface UploadedFile {
    url: string;
    path: string;
    type: 'image' | 'video';
}

interface IElementToCheck {
    elementTitle: string;
    checkStatus: 'not_exists' | 'exists';
}

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
    elementsToCheck: {
        hashtags?: IElementToCheck[];
        tags?: IElementToCheck[];
        coupon?: IElementToCheck;
    } = {
        hashtags: [],
        tags: [],
        coupon: null,
    };

    campaignDetail: ICampaignDetail;
    influencerCampaignId: string;
    brandCampaignId: string;

    pageHeaderConfig: HeaderConfig;

    imageUploadConfig = {
        files: [],
        accept: 'image/*',
        multiple: true,
        privateSelectable: true,
        maxSingleFileSize: null,
        maxFileCount: 10,
        get selectable() {
            return this.files.length < this.maxFileCount;
        },
    };
    videoUploadConfig = {
        files: [],
        accept: 'video/mp4,video/x-m4v,video/*',
        multiple: true,
        maxSingleFileSize: null,
        maxFileCount: 5,
        get selectable() {
            return this.files.length < this.maxFileCount;
        },
    };
    caption: string = '';

    uploadedFiles: { url: string; path: string; file: File }[] = [];
    subscribeList = new Subscription();
    tasks: AngularFireUploadTask[] = [];
    fileProgressMap = new Map<File, number>();
    uploadPath = '/content/';

    isSubmitting = false;

    subscriptions: Subscription[] = [];
    @ViewChild('imgFilePicker') imgFilePicker: FilePickerComponent;
    @ViewChild('videoFilePicker') videoFilePicker: FilePickerComponent;

    constructor(
        private toastService: ToastService,
        private storage: AngularFireStorage,
        private campaignDetailService: CampaignDetailService,
        private campaignsService: CampaignsService,
        private campaignService: CampaignService,
        private router: Router,
        public auth: AngularFireAuth,
        public activatedRoute: ActivatedRoute
    ) {
        // TODO: Judge if enter file upload page is correct.
        // Noted that this is inf campaign id.
        this.brandCampaignId = this.activatedRoute.snapshot.paramMap.get('brandCampaignId');
        this.influencerCampaignId = this.activatedRoute.snapshot.paramMap.get('campaignId');
        this.pageHeaderConfig = {
            backUrl: `/campaign/${this.brandCampaignId}`,
            rightLinkText: 'Submit for Review',
            replaceUrl: true,
        };
    }

    get files(): (File | UploadedFile)[] {
        return [...this.imageUploadConfig.files, ...this.videoUploadConfig.files];
    }

    get newUploadFile(): File[] {
        return [...this.imageUploadConfig.files, ...this.videoUploadConfig.files].filter((file) => file instanceof File);
    }

    get isAllTaskFinished() {
        return this.uploadedFiles.length === this.newUploadFile.length;
    }

    async ngOnInit() {
        const historyList = await (await this.campaignDetailService.getCampaignById(this.influencerCampaignId)).toPromise();
        this.campaignDetail = historyList?.history_list[0];

        const brandCampaign = await this.campaignService.getInfluencerCampaignDetail(this.brandCampaignId, this.campaignDetail['uid']);
        this.subscriptions.push(
            brandCampaign.subscribe((detail) => {
                this.elementsToCheck.coupon = detail.influencer_public_profile.campaign_coupon_code
                    ? {
                          elementTitle: detail.influencer_public_profile.campaign_coupon_code,
                          checkStatus: 'not_exists',
                      }
                    : null;
                if (
                    detail.influencer_public_profile?.offer_detail &&
                    Array.isArray(detail.influencer_public_profile.offer_detail.post_hastags)
                ) {
                    this.elementsToCheck.hashtags = detail.influencer_public_profile.offer_detail.post_hastags.map((hashtag) => {
                        return {
                            elementTitle: hashtag,
                            checkStatus: 'not_exists',
                        };
                    });
                }
                if (
                    detail &&
                    detail.influencer_public_profile?.offer_detail &&
                    Array.isArray(detail.influencer_public_profile.offer_detail.post_tags)
                ) {
                    this.elementsToCheck.tags = detail.influencer_public_profile.offer_detail.post_tags.map((tag) => {
                        return {
                            elementTitle: tag,
                            checkStatus: 'not_exists',
                        };
                    });
                }

                this.setDefaultValue();
            })
        );
    }

    hasRequirements() {
        return this.elementsToCheck.hashtags.length || this.elementsToCheck.tags.length || !!this.elementsToCheck.coupon;
    }

    ngOnDestroy() {
        this.subscribeList.unsubscribe();
    }

    // File selected
    fileChange(files: File[], type: 'image' | 'video') {
        const config = this.getConfig(type);

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

        config.files = config.files.concat(Array.from(files));
    }

    removeFile(file: File | UploadedFile, type: 'image' | 'video') {
        const config = this.getConfig(type);

        const index = config.files.indexOf(file);
        if (index >= 0) {
            config.files.splice(index, 1);
        }
    }

    getConfig(type: 'image' | 'video') {
        if (type === 'image') {
            return this.imageUploadConfig;
        }

        if (type === 'video') {
            return this.videoUploadConfig;
        }
    }

    startUpload(file: File) {
        const uploadSubscribe = this.auth.user.subscribe(() => {
            // The storage path
            // NOTE: need a way to get auth so that we can tie the video's path to authentication
            const indexOfDot = file.name.lastIndexOf('.');
            const fileType = file.name.slice(indexOfDot);
            const path = `${this.uploadPath}${this.influencerCampaignId}/${Date.now()}/${random(0, 100000)}${
                indexOfDot === -1 ? '' : fileType
            }`;

            // Reference to storage bucket
            const ref = this.storage.ref(path);

            // The main task
            const task = this.storage.upload(path, file);
            this.tasks.push(task);
            const taskPercentageSubscribe = task.percentageChanges().subscribe((pct) => {
                this.fileProgressMap.set(file, pct);
            });

            const uploadTaskSubscribe = task.snapshotChanges().subscribe(
                null,
                () => {
                    this.handleIfUploadFail();
                    this.uploadedFiles.length = 0; // Empty uploaded files
                    this.tasks.forEach((task) => task.cancel());
                    this.tasks.length = 0; // Empty task list
                },
                async () => {
                    // Set file percentage to 100 after upload completed
                    this.fileProgressMap.set(file, 100);
                    const downloadUrl = await ref.getDownloadURL().toPromise();
                    this.uploadedFiles.push({ url: downloadUrl, path, file });
                    if (this.isAllTaskFinished) {
                        this.updateCampaign();
                    }
                }
            );

            this.subscribeList.add(uploadTaskSubscribe);
            this.subscribeList.add(taskPercentageSubscribe);
        });

        this.subscribeList.add(uploadSubscribe);
    }

    clickUpload() {
        this.isSubmitting = true;

        // If no new file to upload, we just need update campaign
        if (this.newUploadFile.length === 0) {
            this.updateCampaign();
        } else {
            // Do startUpload for every new file
            this.newUploadFile.forEach((file) => {
                this.startUpload(file);
            });
        }

        this.imgFilePicker.startUpload();
        this.videoFilePicker.startUpload();
    }

    setDefaultValue() {
        if (this.campaignDetail?.content) {
            this.imageUploadConfig.files = this.campaignDetail?.content?.images.map((img) => {
                return { url: img.url, type: 'image', path: img.path };
            });
            this.videoUploadConfig.files = this.campaignDetail?.content?.videos.map((video) => {
                return { url: video.url, type: 'video', path: video.path };
            });
        }
        this.caption = this.campaignDetail?.description ? this.campaignDetail?.description : '';
        this.checkRequirements();
    }

    async updateCampaign() {
        const images = [
            ...this.uploadedFiles
                .filter((file) => file.file.type.startsWith('image'))
                .map((file) => {
                    return { url: file.url, path: file.path };
                }),
            ...this.imageUploadConfig.files
                .filter((file) => !(file instanceof File))
                .map((file) => {
                    return { url: file.url, path: file.path };
                }),
        ];
        const videos = [
            ...this.uploadedFiles
                .filter((file) => file.file.type.startsWith('video'))
                .map((file) => {
                    return { url: file.url, path: file.path };
                }),
            ...this.videoUploadConfig.files
                .filter((file) => !(file instanceof File))
                .map((file) => {
                    return { url: file.url, path: file.path };
                }),
        ];
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
                    .then(() => this.router.navigate([`/campaign-review/${this.brandCampaignId}/${this.influencerCampaignId}`]))
                    .catch(() => this.handleIfUploadFail());
            },
            () => this.handleIfUploadFail()
        );
    }

    checkRequirements() {
        Object.keys(this.elementsToCheck).forEach((sectionKey) => {
            if (sectionKey !== 'coupon') {
                this.elementsToCheck[sectionKey].forEach((valueToCheck) => {
                    if (this.caption.toLowerCase().indexOf(valueToCheck.elementTitle.toLowerCase(), 0) !== -1) {
                        valueToCheck.checkStatus = 'exists';
                    } else {
                        valueToCheck.checkStatus = 'not_exists';
                    }
                });
            } else {
                if (this.elementsToCheck[sectionKey] !== null) {
                    if (this.caption.toLowerCase().indexOf(this.elementsToCheck[sectionKey].elementTitle.toLowerCase(), 0) !== -1) {
                        this.elementsToCheck[sectionKey].checkStatus = 'exists';
                    } else {
                        this.elementsToCheck[sectionKey].checkStatus = 'not_exists';
                    }
                }
            }
        });
    }

    isAllInSectionExist(section: string) {
        return this.elementsToCheck[section].every((element) => element.checkStatus === 'exists');
    }

    isTextValid() {
        return Object.keys(this.elementsToCheck).every((sectionKey) => {
            if (sectionKey !== 'coupon') {
                return this.elementsToCheck[sectionKey].every((element) => element.checkStatus === 'exists');
            } else {
                if (this.elementsToCheck[sectionKey] !== null) {
                    return this.elementsToCheck[sectionKey].checkStatus === 'exists';
                }
                return true;
            }
        });
    }

    showFailMessage(message: string) {
        this.toastService.fail(message, 2000, null, false, 'middle');
    }

    handleIfUploadFail() {
        this.showFailMessage('Upload file failed, please try again later');

        this.imgFilePicker.showProgressBar = false;
        this.videoFilePicker.showProgressBar = false;
        this.fileProgressMap.clear();

        this.isSubmitting = false;
    }
}
