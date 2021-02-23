import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { ImageCache, ImageSource } from '@nativescript/core';
import { Observable } from 'rxjs';

@Pipe({
    name: 'fromCache',
    pure: false,
})
export class FromCachePipe implements PipeTransform {
    private cache: ImageCache;

    constructor(private cdr: ChangeDetectorRef) {
        this.cache = new ImageCache();
        this.cache.maxRequests = 10;
    }

    transform(url: string) {
        this.cache.enableDownload();

        return new Observable((observer) => {
            console.log('obddadf');
            const imageFromCache = this.cache.get(url);
            console.log(imageFromCache);
            if (imageFromCache) {
                observer.next(imageFromCache);
                observer.complete();
                this.cache.disableDownload();
                return;
            }

            observer.next(this.cache.placeholder);

            this.cache.push({
                key: url,
                url,
                completed: (image: any, key: string) => {
                    console.log('complete');
                    if (url === key) {
                        observer.next(new ImageSource(image));
                        observer.complete();
                        this.cache.disableDownload();
                        setTimeout(() => {
                            this.cdr.detectChanges();
                        }, 1000);
                    }
                },
            });
        });
    }
}
