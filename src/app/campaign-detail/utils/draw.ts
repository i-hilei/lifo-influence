export function drawImageByVideo(file: File | { url: string }) {
    return new Promise<{ url: string; videoElement: HTMLVideoElement }>((resolve, reject) => {
        let url = '';
        if (file instanceof File) {
            url = getObjectURL(file);
        } else {
            url = file.url;
        }
        const video = document.createElement('video');
        const snapImage = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            const image = canvas.toDataURL('image/jpeg');
            resolve({
                url: image,
                videoElement: video,
            });
        };
        video.onloadeddata = function () {
            snapImage();
        };
        video.setAttribute('crossOrigin', 'anonymous');
        video.preload = 'auto';
        video.src = url;
        video.muted = true;
        video.load();
    });
}

export function getObjectURL(file) {
    let url = null;
    if (window?.URL) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window?.webkitURL) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
