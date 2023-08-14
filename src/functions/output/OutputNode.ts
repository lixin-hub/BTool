import { NodeOptions, NodeType, Property, StreamType } from "@/types";
import { UUID } from "@/util/util";
import { merge } from "lodash";
import { DocNodeClass } from "../DocNodeClass";
import { convertAudioBufferToBlob, saveBlobAsFile } from "@/util/AudioUtil";
import { message } from "ant-design-vue";
import { HightlightDecorators } from "@/decorators";
export class OutPutNode extends DocNodeClass {
    constructor(data: NodeOptions) {
        super(data);
        //合并选项与自定义选项
        merge(this, {
            type: NodeType.TYPE_OUTPUT,
            maxInputNum: 1,
            inputType: StreamType.AUDIO,
            outputType: StreamType.NONE,
            fileName: UUID(4),
            customProperties: Array<Property>(
                { name: "fileName", label: "文件名", editable: true }
            )
        })
        this.contextMenuItems =  this.contextMenuItems.filter((item)=>item.tips!=="preview")
    }
    @HightlightDecorators()
    async exec(playload: AudioBuffer, name: string){
        this.inputPlayload = playload || this.getPreNode()
        if (!this.inputPlayload) {
            message.error("节点无输入")
            return
        }
        let blob = await convertAudioBufferToBlob(this.inputPlayload);
        await saveBlobAsFile(blob, name || 'trimmed_audio.wav');
    }

}