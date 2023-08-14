import { convertAudioBufferToBlob, fileToAudioBuffer } from "@/util/AudioUtil";
import WaveSurferCache from "@/util/WaveSurferCache";
import { message } from "ant-design-vue";
import WaveSurfer from "wavesurfer.js";

export class MyWaveSurfer {
    // 是否允许加载，在全局执行的时候不加载波形
    private static _alowLoading = true;
    public static get alowLoading() {
        return MyWaveSurfer._alowLoading;
    }
    public static set alowLoading(value) {
        MyWaveSurfer._alowLoading = value;
    }
    pause() {
        this.ws.pause()
    }
    play() {
        this.ws.play()
    }
    ws: WaveSurfer
    constructor(ws: WaveSurfer) {
        this.ws = ws
    }

    async loadFile(file: File): Promise<void> {
        try {
            let buffer = await fileToAudioBuffer(file)
            this.ws.loadBlob(await convertAudioBufferToBlob(buffer))
        } catch (error) {
            message.error("文件转换出错")
        }
    }
    async loadBuffer(buffer: AudioBuffer): Promise<void> {
        if (!MyWaveSurfer.alowLoading){
            return
        }
            try {
                await this.ws.loadBlob(await convertAudioBufferToBlob(buffer))
            } catch (error) {
                console.log(error);
                message.error("文件转换出错")
            }
    }
    destroy(id?: string): void {
        this.ws.destroy()
        if (id)
            WaveSurferCache.remove(id)
    }

}
