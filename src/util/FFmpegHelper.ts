import { FFmpeg } from "@ffmpeg/ffmpeg";
import { FileData, LogEvent } from "@ffmpeg/ffmpeg/dist/esm/types";
import { toBlobURL } from "@ffmpeg/util";
import { Modal } from "ant-design-vue";
import { convertAudioBufferToWavBuffer } from "./AudioUtil";
import { getWasmCoreWasm } from '@/util/FetchUtil'
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
                // const baseURL = 'http://localhost:5173'
                const baseURL = 'https://42.193.22.5/ffmpeg'
                // const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm'
                try {
                    const blob = await getWasmCoreWasm()
                    await this.ffmpegInstance.load({
                        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                        wasmURL: await toBlobURL(URL.createObjectURL(blob), 'application/wasm'),
                        // wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'applicaiton/wasm'),
                        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
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
    async transcode(inputData: Blob | ArrayBuffer, inputFileName: string, outPutFileName: string, exec: string[], pg?: (model: any, p: number) => void, log?: (modal: any, e: LogEvent) => void): Promise<FileData> {
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

                let arraybuffer: ArrayBuffer = (inputData instanceof Blob) ? await inputData.arrayBuffer() : inputData
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

    // static async mergeAudio(buffer1: AudioBuffer, buffer2: AudioBuffer, offset1: number, offset2: number) {
    //     return new Promise(async function (resolove, reject) {
    //         const modal = Modal.info({
    //             title: '运行日志',
    //             content: "正在运行",
    //             footer: false
    //         });
    //         const ffmpeg = await FFmpegHelper.getInstance().getFFmpeg()
    //         ffmpeg.on('log', (e: LogEvent) => {
    //             modal.update({
    //                 content: e.message + '--------PROGRESS---------' + Number(progress * 100).toFixed(2) + "%",
    //             });
    //         })
    //         let progress = 0
    //         ffmpeg.on("progress", (p) => {
    //             progress = p.progress
    //             if (progress >= 1) {
    //                 modal.destroy()
    //             }
    //         })
    //         try {
    //             let arrayBuffer1 = await convertAudioBufferToWavBuffer(buffer1)
    //             let arrayBuffer2 = await convertAudioBufferToWavBuffer(buffer2)
    //             await ffmpeg.writeFile("input1.wav", new Uint8Array(arrayBuffer1))
    //             await ffmpeg.writeFile("input2.wav", new Uint8Array(arrayBuffer2))

    //             const args = [
    //                 '-i', "input1.wav",
    //                 '-i', "input2.wav",
    //                 '-filter_complex',
    //                 `[0:a]atrim=start=${offset1 / 1000},asetpts=PTS-STARTPTS[a1];[1:a]atrim=start=${offset2 / 1000},asetpts=PTS-STARTPTS[a2];[a1][a2]amix=inputs=2:duration=first:dropout_transition=2[a]`,
    //                 '-map', '[a]',
    //                 '-c:a', 'pcm_s16le',
    //                 'output.wav'
    //             ];
    //             await ffmpeg.exec(args)
    //             const data = await ffmpeg.readFile("output.wav")
    //             modal.destroy()
    //             resolove(data)
    //         } catch (error) {
    //             console.log(error);
    //             modal.destroy()
    //             reject(error)
    //         }

    //     });
    // }
    static async easeInOut(audioBuffer: AudioBuffer, easeInTime: number, easeOutTime: number): Promise<FileData> {
        return new Promise(async function (resolove, reject) {
            const modal = Modal.info({
                title: '运行日志',
                content: "正在运行",
                footer: false
            });
            const ffmpeg = await FFmpegHelper.getInstance().getFFmpeg()
            ffmpeg.on('log', (e: LogEvent) => {
                modal.update({
                    content: e.message + '--------PROGRESS---------' + Number(progress * 100).toFixed(2) + "%",
                });

            })
            let progress = 0
            ffmpeg.on("progress", (p) => {
                progress = p.progress
                if (progress >= 1) {
                    modal.destroy()
                }
            })

            try {
                let arrayBuffer = await convertAudioBufferToWavBuffer(audioBuffer)
                await ffmpeg.writeFile("input.wav", new Uint8Array(arrayBuffer))

                const args = [
                    '-i', 'input.wav',
                    '-af', `afade=t=in:ss=0:d=${easeInTime},afade=t=out:st=${audioBuffer.duration - easeOutTime}:d=${easeOutTime}`,
                    'output.wav',
                ];
                await ffmpeg.exec(args)
                const data = await ffmpeg.readFile("output.wav")
                modal.destroy()
                resolove(data)
            } catch (error) {
                console.log("helper:", error);
                modal.destroy()
                reject(error)
                throw error
            }
        });
    }

}