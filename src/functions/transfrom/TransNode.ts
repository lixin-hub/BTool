import { NodeOptions, NodeType, StreamType } from "@/types";
import { UUID } from "@/util/util";
import { merge, cloneDeep } from "lodash";
import { DocNodeClass } from "../DocNodeClass";

export class TransNode extends DocNodeClass {
    constructor(data: NodeOptions) {
        super(data);
        //合并选项与自定义选项
        merge(this, cloneDeep(data), {
            type: NodeType.TYPE_AUDIO_TRANS,
            maxInputNum: 1,
            inputType: StreamType.AUDIO,
            outputType: StreamType.AUDIO,
            fileName: UUID(4),
            customProperties: [
            ]
        },
        )
    }

}