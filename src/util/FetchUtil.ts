import { Modal } from 'ant-design-vue';
import axios from 'axios';
// fetchUtil.js
import { get, set } from 'idb-keyval';

export function downloadFile(url: string, progress: (p: number) => void) {
    return axios({
        url: url,
        method: 'GET',
        responseType: 'blob',
        onDownloadProgress: (pe) => {
            progress(pe.progress as number)
        }
    }).then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('File download failed:', error);
            return null;
        });
}
// 示例用法
export async function getWasmCoreWasm(): Promise<Blob> {
    return new Promise(async function (resolve) {
        const modal = Modal.info({
            title: '正在加载资源',
            content: "首次打开网站需提前加载资源，后续可直接使用，请稍后！",
            footer: false
        });
        let wasm = await get("ffmpeg-core.wasm")
        if (!wasm) {
            const url = 'http://42.193.22.5/ffmpeg/ffmpeg-core.wasm'; // ffmpeg.wasm 文件的 URL
            let wasm = await downloadFile(url, (p) => {
                modal.update({
                    content:`当前进度：${Number(p*100).toFixed(3)}%`
                })
            })
            await set("ffmpeg-core.wasm", wasm)
        }
        modal.destroy()
        resolve(wasm)
    })

}
