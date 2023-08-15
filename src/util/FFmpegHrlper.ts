import { FFmpeg } from "@ffmpeg/ffmpeg";
import { FileData, LogEvent } from "@ffmpeg/ffmpeg/dist/esm/types";
import { toBlobURL } from "@ffmpeg/util";
import { Modal } from "ant-design-vue";
import { ModalFunc } from "ant-design-vue/es/modal/Modal";
import progress from "ant-design-vue/es/progress";
import { reject } from "lodash";

export class FFmpegHelper {

    private static helperInstance: FFmpegHelper
    private constructor() {

    }
    private ffmpegInstance: FFmpeg | undefined
    public static getInstance(): FFmpegHelper {
        if (!FFmpegHelper.helperInstance) {
            FFmpegHelper.helperInstance = new FFmpegHelper()
        }
        return FFmpegHelper.helperInstance
    }
    async getFFmpeg(): Promise<FFmpeg> {
        return new Promise(async (resolove, reject) => {
            if (!this.ffmpegInstance) {
                this.ffmpegInstance = new FFmpeg()
                const baseURL = 'http://localhost:5173'
                // const wasmurl='https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm/ffmpeg-core.wasm'
                try {
                    await this.ffmpegInstance.load({
                        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'application/javascript'),
                        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'applicaiton/wasm'),
                        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'application/javascript'),
                    })
                    resolove(this.ffmpegInstance)
                } catch (error) {
                    console.log(error);
                    reject(error)
                }
            } else {
                resolove(this.ffmpegInstance)
            }
        })
    }
    /**
     * 
     * @param inputFile 输入文件对象
     * @param outPutFileName 输出文件名
     * @param ext 输出文件名格式
     */
    async transcode(inputData: Blob|ArrayBuffer,inputFileName:string, outPutFileName: string,exec:string[], pg?: (model: any, p: number) => void, log?: (modal: any, e: LogEvent) => void): Promise<FileData> {
        return new Promise(async function (resolove, reject) {
            const modal = Modal.info({
                title: '运行日志',
                content: "正在运行",
                footer: false
            });
            const ffmpeg = await FFmpegHelper.getInstance().getFFmpeg()
            ffmpeg.on('log', (e: LogEvent) => {
                if (log) {
                    log(modal, e)
                    return
                }
                modal.update({
                    content: e.message + '--------PROGRESS---------' + Number(progress * 100).toFixed(2) + "%",
                });
            })
            let progress = 0
            ffmpeg.on("progress", (p) => {
                if (pg) {
                    pg(modal, p.progress)
                    return
                }
                progress = p.progress
                if (progress >= 1) {
                    modal.destroy()
                }
            })
            try {
            
                let arraybuffer:ArrayBuffer=(inputData instanceof Blob)?await inputData.arrayBuffer():inputData
                await ffmpeg.writeFile(inputFileName, new Uint8Array(arraybuffer))
                await ffmpeg.exec(exec)
                const data = await ffmpeg.readFile(outPutFileName)
                modal.destroy()
                resolove(data)
            } catch (error) {
                console.log(error);
                modal.destroy()
                reject(error)
            }

        });
    }
}