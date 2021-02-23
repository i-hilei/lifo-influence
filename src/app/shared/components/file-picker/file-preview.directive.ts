import { Directive, ElementRef, Input } from '@angular/core';
import { padStart } from 'ng-zorro-antd';

import { UploadedFile } from '../../../campaign-detail/file-upload/file-upload.component';

import { drawImageByVideo, getObjectURL } from '@src/app/campaign-detail/utils/draw';

@Directive({ selector: '[filePreview]' })
export class ImgVideoPreview {
    @Input() file: File | UploadedFile;

    constructor(private el: ElementRef) {}

    async ngAfterViewInit() {
        if (this.file instanceof File) {
            const URL = getObjectURL(this.file);

            if (this.file.type.startsWith('image')) {
                this.setBgImage(URL, this.el.nativeElement);
            }

            if (this.file.type.startsWith('video')) {
                const { url, videoElement } = await drawImageByVideo(this.file);
                this.setBgImage(url, this.el.nativeElement);
                this.generateDurationSpan(videoElement, this.el.nativeElement);
            }
        } else {
            if (this.file.type === 'image') {
                this.setBgImage(this.file.url, this.el.nativeElement);
            }

            if (this.file.type === 'video') {
                const { url, videoElement } = await drawImageByVideo(this.file);
                this.setBgImage(url, this.el.nativeElement);
                this.generateDurationSpan(videoElement, this.el.nativeElement);
            }
        }
    }

    convertTime(seconds: number) {
        const mins = padStart(String(Math.round(seconds / 60)), 2, '0');
        const restSeconds = padStart(String(Math.round(seconds % 60)), 2, '0');
        return `${mins}:${restSeconds}`;
    }

    generateDurationSpan(video: HTMLVideoElement, element: HTMLDivElement) {
        const durationEle = document.createElement('span');
        durationEle.innerText = this.convertTime(video.duration);
        durationEle.setAttribute('style', 'position:absolute; left:2px; bottom:2px; font-size:10px; color:#f2f2f2; font-weight:600');
        element.setAttribute('style', 'position:relative');
        element.append(durationEle);
    }

    setBgImage(url: string, parentElement: HTMLElement) {
        const bgdiv = document.createElement('div');
        bgdiv.className = 'bgdiv';
        bgdiv.setAttribute(
            'style',
            `width:100%;
             height:0;
             padding-bottom:100%;
             background-image:url(${url});
             background-position: 50% 50%;
             background-repeat: no-repeat;
             background-size: cover;`
        );
        parentElement.append(bgdiv);
    }
}
