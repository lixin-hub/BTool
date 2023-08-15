import { NodeOptions, NodeType, Property, StreamType } from "@/types";
import { UUID } from "@/util/util";
import { merge } from "lodash";
import { DocNodeClass } from "../DocNodeClass";
import { message } from "ant-design-vue";
import { HightlightDecorators } from "@/decorators";
import { convertAudioBufferToWavBuffer, saveBlobAsFile } from "@/util/AudioUtil";
import type { FileData } from '@ffmpeg/ffmpeg/dist/esm/types'
import { FFmpegHelper } from "@/util/FFmpegHrlper";
export abstract class OutPutNode extends DocNodeClass {
    taskQueue: any = [];
    fileName: string = UUID(4)
    constructor(data: NodeOptions) {
        super(data);
        //合并选项与自定义选项
        merge(this, {
            type: NodeType.TYPE_OUTPUT,
            maxInputNum: 1,
            inputType: StreamType.AUDIO,
            outputType: StreamType.NONE,
            customProperties: Array<Property>(
                { name: "fileName", label: "文件名", editable: true }
            )
        })
        this.contextMenuItems = this.contextMenuItems.filter((item) => item.tips !== "preview")
        this.fileName = this.getFileName()
    }
    doubleClick(): void {
        this.exec()
    }
    @HightlightDecorators()
    async exec(playload?: AudioBuffer,) {
        this.inputPlayload = playload || this.getPreNode()
        if (!this.inputPlayload) {
            message.error("节点无输入")
            return
        }
        let buffer: any = await convertAudioBufferToWavBuffer(this.inputPlayload)
        let helper = FFmpegHelper.getInstance()
        let data: FileData = await helper.transcode(buffer, "input.wav", this.getFileName(), this.getExecArgs())
        await saveBlobAsFile(new Blob([(data as Uint8Array).buffer], { type: 'audio/' + this.getExection() }), this.getFileName())
    };
    abstract getExecArgs(): string[]
    abstract getExection(): string
    getFileName(): string {
        let index = this.fileName.indexOf(".")
        console.log(index);
        if (index > 0)
            this.fileName = this.fileName.substring(0, index)
        return this.fileName + '.' + this.getExection()
    }
}
