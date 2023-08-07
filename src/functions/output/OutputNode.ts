import { NodeOptions, NodeType, Property, StreamType } from "@/types";
import { UUID } from "@/util/util";
import { merge, cloneDeep } from "lodash";
import { DocNodeClass } from "../DocNodeClass";

export class OutPutNode extends DocNodeClass {
    constructor(data: NodeOptions) {
        super(data);
        //合并选项与自定义选项
        merge(this, cloneDeep(data), {
            type: NodeType.TYPE_OUTPUT,
            maxInputNum: 1,
            inputType: StreamType.AUDIO,
            outputType: StreamType.NONE,
            fileName: UUID(4),
            customProperties: Array<Property>(
                { name: "fileName", label: "文件名", editable: true }
            )
        })
    }


}