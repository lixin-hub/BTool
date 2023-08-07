import useStore from "@/store/common";
import { fileToAudioBuffer } from "@/util/AudioUtil";
import { UUID, openFileManager } from "@/util/util";
import { cloneDeep, merge } from "lodash";
import { DocNodeClass } from "../DocNodeClass";
import { NodeOptions, NodeType, StreamType } from "@/types";

export class InputNode extends DocNodeClass {

    constructor(data: NodeOptions) {
        super(data);
        //合并选项与自定义选项
        merge(this, cloneDeep(data), {
            type: NodeType.TYPE_INPUT,
            maxInputNum: 1,
            inputType: StreamType.NONE,
            outputType: StreamType.AUDIO,
            fileName: UUID(4),
            customProperties: [
                { name: "fileName", label: '文件名称', editable: true }
            ]
        },
        )
    }

    doubleClick = async () => {
        const store = useStore()
        let file = await openFileManager(".mp3")
        this.playload = file
        store.wavedata.file = file
        this.fileName = file.name
        this.file = file
        store.activeNode.file = file
        store.activeNode.fileName = file.name
    }
    exec = async (playload: File): Promise<AudioBuffer> => {
        let audioBuffeawait = await fileToAudioBuffer(playload || this.playload)
        console.log(audioBuffeawait);
        return audioBuffeawait;
    }

}