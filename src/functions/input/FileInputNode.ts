import { ContextMenuSetting, NodeOptions, } from "@/types";
import { InputNode } from "./InputNode";
import { message } from "ant-design-vue";
import useStore from "@/store/common";
import { fileToAudioBuffer } from "@/util/AudioUtil";
import WaveSurferCache from "@/util/WaveSurferCache";
import { HightlightDecorators } from "@/decorators";
import { openFileManager } from "@/util/util";
export class FileInputNode extends InputNode {

    constructor(data: NodeOptions) {
        super(data)
        this.contextMenuItems.push(
            {
                order: -1,
                label: '打开文件',
                tips: 'Open',
                fn: () => {
                    this.doubleClick()
                }
            }
        )
        this.contextMenuItems = this.contextMenuItems.sort(
            (a: ContextMenuSetting, b: ContextMenuSetting) => { return a.order - b.order })

    }
    async doubleClick() {
        const store = useStore()
        let file = await openFileManager(".mp3,.wav,.aac,.lflac,aiff,.m4a,.mmf,.ogg,.opus.wma")
        this.inputPlayload = file
        store.wavedata.file = file
        this.fileName = file.name
        this.file = file
        this.exec()
    }
    @HightlightDecorators()
    async exec(file?: File): Promise<AudioBuffer | void> {
        return new Promise(async (reslove,reject) => {
            file = file || this.inputPlayload
            if (!file) {
                message.error("请双击选择文件")
                reject(undefined)
                return
            }
            let audioBuffer: AudioBuffer | undefined
            audioBuffer = await fileToAudioBuffer(file)
            if (!audioBuffer) return
            //之前存在
            if (WaveSurferCache.has(this.id)) {
                this.getWs().destroy()
            }
            this.outputPlayload = audioBuffer
            this.playload = audioBuffer
            await this.getWs().loadBuffer(audioBuffer)
            //  this.activated()
            reslove(audioBuffer)
        })

    }
}