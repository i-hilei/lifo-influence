/**
 * @description This feature is obsolete.
 * Although it may still work in some browsers, its use is discouraged since it could be removed at any time.
 * Try to avoid using it.
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 * @param msg Message need to be copied.
 * @returns Is successful.
 */
export function copy(msg: string): boolean {
    try {
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.value = msg;
        textarea.select();
        document.execCommand('Copy', false, null);
        document.body.removeChild(textarea);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
