import useStore from "@/store/common";
import { fileToAudioBuffer } from "@/util/AudioUtil";
import { UUID, openFileManager } from "@/util/util";
import { merge } from "lodash";
import { DocNodeClass } from "../DocNodeClass";
import { NodeOptions, NodeType, StreamType } from "@/types";
import { message } from "ant-design-vue";

import WaveSurferCache from "@/util/WaveSurferCache";
import { MenuSetting } from "@howdyjs/mouse-menu/dist/types";
import { HightlightDecorators } from "@/decorators";

export class InputNode extends DocNodeClass {
    constructor(data: NodeOptions) {
        super(data);

        //合并选项与自定义选项
        merge(this, {
            type: NodeType.TYPE_INPUT,
            maxInputNum: 1,
            inputType: StreamType.NONE,
            outputType: StreamType.AUDIO,
            fileName: UUID(4),
        })
        this.customProperties = [
            { name: "fileName", label: '文件名称', editable: true }
        ]
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
            (a: MenuSetting, b: MenuSetting) => { return a.order - b.order })

    }

    async doubleClick() {
        const store = useStore()
        let file = await openFileManager(".mp3")
        this.inputPlayload = file
        store.wavedata.file = file
        this.fileName = file.name
        this.file = file
        this.exec()
    }
    @HightlightDecorators()
    async exec(file?: File): Promise<AudioBuffer | void> {
        file = file || this.inputPlayload
        if (!file) {
            message.error("请双击选择文件")
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
        return audioBuffer;
    }
   

}