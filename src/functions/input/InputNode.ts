
import { UUID, } from "@/util/util";
import { merge } from "lodash";
import { DocNodeClass } from "../DocNodeClass";
import {  NodeOptions, NodeType, StreamType } from "@/types";


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
       
    }




}