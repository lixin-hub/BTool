import { NodeOptions, NodeType, StreamType } from "@/types";
import { UUID } from "@/util/util";
import { merge, cloneDeep } from "lodash";
import { DocNodeClass } from "../DocNodeClass";
import { message } from "ant-design-vue";

export class ProcessNode extends DocNodeClass {
    constructor(data: NodeOptions) {
        super(data);
        //合并选项与自定义选项
        merge(this, {
            type: NodeType.TYPE_AUDIO_PROCESS,
            maxInputNum: 1,
            inputType: StreamType.AUDIO,
            outputType: StreamType.AUDIO,
            fileName: UUID(4),
            contextMenuItems: [
                {
                    label: '执行',
                    tips: 'exec',
                    fn: async () => {
                        if (this.exec) {
                            try {
                                let r = await this.exec()
                                this.outPutPlayload = r
                                message.info("执行完成")
                            } catch {
                                message.error("执行失败")
                            }
                        }
                    }
                },


            ],
        },
            cloneDeep(data),
        )
    }


}