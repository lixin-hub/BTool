import { convertAudioBufferToBlob, fileToAudioBuffer } from "@/util/AudioUtil";
import WaveSurferCache from "@/util/WaveSurferCache";
import { message } from "ant-design-vue";
import WaveSurfer from "wavesurfer.js";

export class MyWaveSurfer {
   
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
    show() {
        this.ws.getWrapper().style.display = "block"
    }
    hide() {
        console.log("hide");
        this.ws.getWrapper().style.display = "none"
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
        try {
            this.ws.loadBlob(await convertAudioBufferToBlob(buffer))
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
