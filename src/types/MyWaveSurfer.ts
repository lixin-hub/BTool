import { convertAudioBufferToWavBlob, fileToAudioBuffer } from "@/util/AudioUtil";
import WaveSurferCache from "@/util/WaveSurferCache";
import { message } from "ant-design-vue";
import WaveSurfer from "wavesurfer.js";
import useCommonStore from '@/store/common'
const store = useCommonStore()
export class MyWaveSurfer {

    // 是否允许加载，在全局执行的时候不加载波形
    private static _alowLoading = true;
    public static get alowLoading() {
        return MyWaveSurfer._alowLoading;
    }
    public static set alowLoading(value) {
        if (!value) {
            MyWaveSurfer.hideAllWave()
        }
        MyWaveSurfer._alowLoading = value;
    }
    static hideAllWave() {
        store.nodeList.forEach(node => {
            node.hideWave("wave" + node.id)
        })
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
    async loadBlob(blob: Blob) {
        if (!MyWaveSurfer.alowLoading) {
            return
        }
        console.log("加载");

        await this.ws.loadBlob(blob)
    }

    async loadFile(file: File): Promise<void> {

        try {
            let buffer = await fileToAudioBuffer(file)  
            this.ws.loadBlob(await convertAudioBufferToWavBlob(buffer))
        } catch (error) {
            message.error("文件转换出错")
        }
    }
    async loadBuffer(buffer: AudioBuffer): Promise<void> {
        //不允许加载或buffer为空        
        if (!MyWaveSurfer.alowLoading) {
            return
        }
        console.log("加载", MyWaveSurfer.alowLoading)

        try {
            await this.ws.loadBlob(await convertAudioBufferToWavBlob(buffer))
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
