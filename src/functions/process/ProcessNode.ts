import { NodeOptions, NodeType, StreamType } from "@/types";
import { trimAudioFromBuffer, trimAudioFromFile } from "@/util/AudioUtil";
import { UUID } from "@/util/util";
import { merge, cloneDeep } from "lodash";
import { DocNodeClass } from "../DocNodeClass";

export class ProcessNode extends DocNodeClass {
    constructor(data: NodeOptions) {
        super(data);
        //合并选项与自定义选项
        merge(this, cloneDeep(data), {
            type: NodeType.TYPE_AUDIO_PROCESS,
            maxInputNum: 1,
            inputType: StreamType.AUDIO,
            outputType: StreamType.AUDIO,
            fileName: UUID(4),
        },
        )
    }
    exec = async (playload: File | AudioBuffer, start: number, end: number): Promise<AudioBuffer> => {
        this.playload = playload
        return (playload instanceof File) ? await trimAudioFromFile(playload, start || this.start, end || this.end) : trimAudioFromBuffer(playload, start || this.start, end || this.end)
    }

}